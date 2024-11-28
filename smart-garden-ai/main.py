from fastapi import FastAPI, HTTPException
import pandas as pd
import joblib
import asyncio
import aiomysql
import logging

# Carregar o modelo salvo
model = joblib.load("fertilizer_recommendation_model.pkl")

# Inicializar o FastAPI
app = FastAPI()

# Configuração do banco de dados
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "admin",
    "db": "smartlettuce",
}

# Dicionário de mensagens para os fertilizantes
FERTILIZER_MESSAGES = {
    "High-N Fertilizer": "Nitrogênio muito baixo, aplique fertilizantes ricos em Nitrogênio.",
    "High-P Fertilizer": "Fósforo muito baixo, aplique fertilizantes ricos em Fósforo.",
    "High-K Fertilizer": "Potássio muito baixo, aplique fertilizantes ricos em Potássio.",
    "pH Adjuster": "pH fora da faixa ideal, ajuste com um regulador de pH.",
    "EC Booster": "Condutividade elétrica baixa, aplique um booster de EC.",
    "Balanced Fertilizer": "Os níveis do solo estão balanceados",
}

# Configuração de logging para depuração
logging.basicConfig(level=logging.INFO)

# Conectar ao banco de dados e inserir um evento
async def insert_event(desc: str, level: str, gene_by_ia: int, device_id: int):
    try:
        pool = await aiomysql.create_pool(**DB_CONFIG)
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                # Alteração: Utilizando %s para todos os parâmetros
                query = "INSERT INTO tb_events (`desc`, level, gene_by_ia, device_id) VALUES (%s, %s, %s, %s)"
                try:
                    await cur.execute(query, (desc, level, gene_by_ia, device_id))
                    await conn.commit()
                except aiomysql.MySQLError as e:
                    # Captura e ignora o erro de duplicação de chave (pode ser ajustado conforme o tipo do erro)
                    if "Duplicate entry" in str(e):
                        logging.info(f"Evento duplicado para device_id {device_id} não inserido.")
                    else:
                        logging.error(f"Erro ao tentar inserir evento: {e}")
                        raise HTTPException(status_code=500, detail="Erro ao inserir evento no banco de dados")
        pool.close()
        await pool.wait_closed()
    except Exception as e:
        logging.error(f"Erro ao conectar ao banco de dados para inserir evento: {e}")
        raise HTTPException(status_code=500, detail="Erro ao inserir evento no banco de dados")


# Função para pegar todos os device_ids distintos da tabela tb_measures
async def get_distinct_device_ids():
    try:
        pool = await aiomysql.create_pool(**DB_CONFIG)
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                query = "SELECT DISTINCT device_id FROM tb_measures"
                await cur.execute(query)
                device_ids = await cur.fetchall()
        return [device_id[0] for device_id in device_ids]
    except Exception as e:
        logging.error(f"Erro ao buscar device_ids: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar device_ids")

# Função para pegar o último registro de um device_id específico
async def get_latest_measure_for_device(device_id: str):
    try:
        pool = await aiomysql.create_pool(**DB_CONFIG)
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                query = """
                    SELECT Nitrogen, Phosphorus, Potassium, pH, Conductivity, Temperature, Humidity 
                    FROM tb_measures 
                    WHERE device_id = %s 
                    ORDER BY created_at DESC  # Corrigido para usar 'created_at' ao invés de 'timestamp'
                    LIMIT 1
                """
                await cur.execute(query, (device_id,))
                result = await cur.fetchone()
        if result is None:
            logging.warning(f"Nenhum registro encontrado para device_id: {device_id}")
        return result
    except Exception as e:
        logging.error(f"Erro ao buscar medidas para device_id {device_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar medidas no banco de dados")


# Função para fazer a predição com o modelo carregado
def predict_fertilizer_model(input_data: pd.DataFrame):
    # Utilizando o modelo carregado para prever
    prediction = model.predict(input_data)
    return prediction

# Endpoint de predição
@app.post("/predict")
async def predict_fertilizer():
    try:
        # Buscar todos os device_ids distintos
        device_ids = await get_distinct_device_ids()

        if not device_ids:
            return {"error": "No devices found in tb_measures."}

        # Iterar sobre todos os device_ids para realizar a predição
        for device_id in device_ids:
            # Buscar o último registro de cada device_id
            measure_data = await get_latest_measure_for_device(device_id)

            if not measure_data:
                continue

            # Desestruturar os dados do registro
            nitrogen, phosphorus, potassium, ph, conductivity, temperature, humidity = measure_data

            # Criar um DataFrame com os dados do registro
            input_data = pd.DataFrame([{
                "Nitrogen (ppm)": nitrogen,
                "Phosphorus (ppm)": phosphorus,
                "Potassium (ppm)": potassium,
                "pH": ph,
                "Conductivity (dS/m)": conductivity,
                "Temperature (°C)": temperature,
                "Humidity (%)": humidity
            }])

            # Fazer a predição
            prediction = predict_fertilizer_model(input_data)

            # Obter o fertilizante previsto
            predicted_fertilizer = prediction[0]  # Considerando que a predição retorna uma lista ou array

            # Obter a mensagem correspondente ao fertilizante
            desc = FERTILIZER_MESSAGES.get(predicted_fertilizer, "Fertilizer recommendation not found.")

            # Inserir no banco de dados
            await insert_event(desc=predicted_fertilizer, level="info", gene_by_ia=1, device_id=device_id)

        return {"message": "Predictions and events processed for all devices."}
    
    except Exception as e:
        logging.error(f"Erro na predição: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar predições")
