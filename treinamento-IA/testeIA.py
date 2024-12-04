import pandas as pd
from pycaret.classification import *

# Carregar o dataset de treinamento
df = pd.read_csv('extended_simulated_fertilizer_recommendations.csv')

# Verificar as primeiras linhas do dataset para garantir que os dados estão corretos
print(df.head())

# Configurar o ambiente do PyCaret para classificação sem filtrar os dados
clf1 = setup(
    data=df,
    target='Recommended Fertilizer',
    session_id=42,
    normalize=True
)

# Treinar todos os modelos disponíveis
model = compare_models()

# Avaliar o desempenho do modelo selecionado
evaluate_model(model)

# Realizar previsões com o modelo treinado
new_data = pd.DataFrame({
    "Nitrogen (mg/kg)": [80],
    "Phosphorus (mg/kg)": [20],
    "Potassium (mg/kg)": [180],
    "pH": [6.5],
    "Conductivity (us/cm)": [1.5],
    "Temperature Soil (°C)": [22],
    "Humidity (%RH)": [75],
    "Salinity (mg/L)": [120],
    "TDS (mg/L)": [350],
    "Conductivity factor": [4],
    "Salinity factor": [3],
    "feels_like": [23],
    "temp": [20],
    "temp_min": [22],
    "temp_max": [24],
    "pressure": [1015],
    "humidity": [75]
})

# Fazer previsão com o modelo treinado
predictions = predict_model(model, data=new_data)
print(predictions)

# Salvar o modelo treinado para uso posterior
save_model(model, 'fertilizer_classification_model')
