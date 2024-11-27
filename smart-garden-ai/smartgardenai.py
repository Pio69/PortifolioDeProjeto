from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import asyncio
import aiomysql

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

# Modelo de dados para a API
class SensorData(BaseModel):
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    pH: float
    Conductivity: float
    Temperature: float
    Humidity: float

# Dicionário de mensagens para os fertilizantes
FERTILIZER_MESSAGES = {
    "High-N Fertilizer": "Nitrogênio muito baixo, aplique fertilizantes ricos em Nitrogênio.",
    "High-P Fertilizer": "Fósforo muito baixo, aplique fertilizantes ricos em Fósforo.",
    "High-K Fertilizer": "Potássio muito baixo, aplique fertilizantes ricos em Potássio.",
    "pH Adjuster": "pH fora da faixa ideal, ajuste com um regulador de pH.",
    "EC Booster": "Condutividade elétrica baixa, aplique um booster de EC.",
    "Balanced Fertilizer": "Os níveis do solo estão balanceados",
}

# Conectar ao banco de dados e inserir um evento
async def insert_event(desc: str, level: str, gene_by_ia: str):
    pool = await aiomysql.create_pool(**DB_CONFIG)
    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            query = "INSERT INTO tb_events (desc, level, gene_by_ia) VALUES (%s, %s, %s)"
            await cur.execute(query, (desc, level, gene_by_ia))
            await conn.commit()
    pool.close()
    await pool.wait_closed()

# Endpoint de predição
@app.post("/predict")
async def predict_fertilizer(data: SensorData):
    # Criar um DataFrame com os dados recebidos
    input_data = pd.DataFrame([{
        "Nitrogen (ppm)": data.Nitrogen,
        "Phosphorus (ppm)": data.Phosphorus,
        "Potassium (ppm)": data.Potassium,
        "pH": data.pH,
        "Conductivity (dS/m)": data.Conductivity,
        "Temperature (°C)": data.Temperature,
        "Humidity (%)": data.Humidity
    }])
    
    # Fazer a predição
    prediction = predict_model(model, data=input_data)
    
    # Extrair o resultado
    predicted_fertilizer = prediction["Label"].iloc[0] if "Label" in prediction.columns else prediction["prediction_label"].iloc[0]
    
    # Obter a mensagem correspondente
    desc = FERTILIZER_MESSAGES.get(predicted_fertilizer, "Fertilizer recommendation not found.")
    
    # Inserir no banco de dados
    await insert_event(desc=desc, level="info", gene_by_ia=predicted_fertilizer)
    
    return {"Predicted Fertilizer": predicted_fertilizer, "Message": desc}
