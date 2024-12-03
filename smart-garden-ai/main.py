import mysql.connector
from fastapi import FastAPI, HTTPException, Query
import pandas as pd
import joblib
import logging
import httpx

# Carregar o modelo salvo
model = joblib.load("fertilizer_classification_model_for_alface.pkl")

# Inicializar o FastAPI
app = FastAPI()

# Dicionário de mensagens para os fertilizantes
FERTILIZER_MESSAGES = {
    "Adicionar Nitrato de Amônio (NH₄NO₃)": "Nitrogênio muito baixo, aplique fertilizantes ricos em Nitrogênio.",
    "Adicionar Superfosfato Simples": "Fósforo muito baixo, aplique fertilizantes ricos em Fósforo.",
    "Adicionar Cloreto de Potássio (KCl)": "Potássio muito baixo, aplique fertilizantes ricos em Potássio.",
    "Adicionar Enxofre Elementar": "pH fora da faixa ideal, ajuste com um regulador de pH.",
    "Adicionar Calcário": "pH fora da faixa ideal, ajuste com um regulador de pH.",
    "Não é necessário ajustar fertilizante": "Os níveis do solo estão balanceados",
}

# Configuração de logging para depuração
logging.basicConfig(level=logging.INFO)

# Função para fazer a predição com o modelo carregado
def predict_fertilizer_model(input_data: pd.DataFrame):
    prediction = model.predict(input_data)
    return prediction

# Função para obter os dados de clima via API usando latitude e longitude
async def get_weather_data(lat: float, lon: float, api_key: str):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
    if response.status_code == 200:
        weather_data = response.json()
        # Extrair dados relevantes de clima
        return {
            "feels_like": weather_data["main"]["feels_like"],
            "temp_min": weather_data["main"]["temp_min"],
            "temp_max": weather_data["main"]["temp_max"],
            "pressure": weather_data["main"]["pressure"],
            "humidity": weather_data["main"]["humidity"]
        }
    else:
        raise HTTPException(status_code=500, detail="Erro ao consultar a API de clima")

# Função para pegar os últimos registros de cada device_id da tabela tb_measures
def get_latest_measure_data():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="admin",
            database="smartlettuce"
        )
        cursor = connection.cursor(dictionary=True)

        # Consulta para pegar o último registro de cada device_id
        query = """
        SELECT * FROM tb_measures
        WHERE (device_id, created_at) IN (
            SELECT device_id, MAX(created_at)
            FROM tb_measures
            GROUP BY device_id
        )
        """
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        connection.close()

        return data
    except mysql.connector.Error as err:
        logging.error(f"Erro ao consultar o banco de dados: {err}")
        raise HTTPException(status_code=500, detail="Erro ao acessar o banco de dados")

# Função para inserir dados na tabela tb_events
def insert_event(data):
    try:
        # Conexão com o banco de dados MySQL
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="admin",
            database="smartlettuce"
        )
        cursor = connection.cursor()

        # Query para inserir dados na tabela tb_events com "INSERT IGNORE"
        query = """
        INSERT IGNORE INTO tb_events (gene_by_ia, device_id, `desc`, level)
        VALUES (%s, %s, %s, %s)
        """

        # Concatenando a mensagem e o fertilizante previsto
        message = data['message'] + ' - ' + data['predicted_fertilizer']

        # Definindo os valores a serem inseridos
        values = (1, data['device_id'], message, 'warning')

        # Executando a query de inserção
        cursor.execute(query, values)
        connection.commit()

        # Fechando a conexão
        cursor.close()
        connection.close()
    except mysql.connector.Error as err:
        logging.error(f"Erro ao inserir dados na tabela tb_events: {err}")
        raise HTTPException(status_code=500, detail="Erro ao inserir no banco de dados")


# Mapeamento das colunas do banco para as colunas esperadas pelo modelo
COLUMN_MAPPING = {
    'Nitrogen': 'Nitrogen (mg/kg)',
    'Phosphorus': 'Phosphorus (mg/kg)',
    'Potassium': 'Potassium (mg/kg)',
    'pH': 'pH',
    'Conductivity': 'Conductivity (us/cm)',
    'Temperature': 'Temperature Soil (°C)',  # Renomear para 'Temperature Soil'
    'Humidity': 'Humidity (%RH)',  # Renomear para 'Humidity (%RH)'
    'Salinity': 'Salinity (mg/L)',  # Renomear para 'Salinity (mg/L)'
    'TDS': 'TDS (mg/L)',  # Renomear para 'TDS (mg/L)'
    'Conductivity factor': 'Conductivity factor (%)',  # Se houver essa coluna
    'Salinity factor': 'Salinity factor (%)'  # Se houver essa coluna
}

# Função para renomear as colunas conforme o mapeamento
def rename_columns(input_data):
    return input_data.rename(columns=COLUMN_MAPPING)

# Endpoint de predição
@app.post("/predict")
async def predict_fertilizer(lat: float = Query(...), lon: float = Query(...), api_key: str = Query(...)):
    try:
        # Obter os dados de clima usando latitude e longitude
        weather_data = await get_weather_data(lat, lon, api_key)

        # Pegar os últimos registros de cada device_id
        measure_data = get_latest_measure_data()

        print(measure_data)

        # Iterar sobre os dados de medida (para cada dispositivo)
        for record in measure_data:
            # Criar um DataFrame com os dados para a predição
            input_data = pd.DataFrame([record])

            # Renomear as colunas para que correspondam aos nomes esperados pelo modelo
            input_data = rename_columns(input_data)

            # Colunas esperadas para a predição
            expected_columns = [
                "Nitrogen (mg/kg)", "Phosphorus (mg/kg)", "Potassium (mg/kg)", "pH", 
                "Conductivity (us/cm)", "Temperature Soil (°C)", "Humidity (%RH)", 
                "Salinity (mg/L)", "TDS (mg/L)", "Conductivity factor (%)", "Salinity factor (%)"
            ]
            
            # Verificar se todas as colunas necessárias estão presentes
            missing_columns = [col for col in expected_columns if col not in input_data.columns]
            if missing_columns:
                logging.warning(f"Registro do device_id {record['device_id']} ignorado. Faltando as colunas: {', '.join(missing_columns)}")
                continue  # Ignorar o registro e passar para o próximo

            # Adicionar os dados de clima ao input_data
            input_data["feels_like"] = weather_data["feels_like"]
            input_data["temp_min"] = weather_data["temp_min"]
            input_data["temp_max"] = weather_data["temp_max"]
            input_data["pressure"] = weather_data["pressure"]
            input_data["humidity"] = weather_data["humidity"]

            # Realizando a predição com o modelo
            prediction = predict_fertilizer_model(input_data)

            # Obter o fertilizante previsto
            predicted_fertilizer = prediction[0]

            # Obter a mensagem correspondente ao fertilizante
            desc = FERTILIZER_MESSAGES.get(predicted_fertilizer, "Fertilizer recommendation not found.")

            # Criar o dicionário com os dados para o insert
            event_data = {
                "device_id": record['device_id'],
                "predicted_fertilizer": predicted_fertilizer,
                "message": desc
            }

            # Inserir os dados na tabela tb_events
            insert_event(event_data)

        return {"message": "Predição realizada com sucesso para os dispositivos válidos."}

    except Exception as e:
        logging.error(f"Erro na predição: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar a predição")
