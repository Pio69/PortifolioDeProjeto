import pandas as pd
from pycaret.classification import *

# Carregar o dataset de treinamento
df = pd.read_csv('fertilizer_recommendations_alface.csv')

# Verificar as primeiras linhas do dataset para garantir que os dados estão corretos
print(df.head())

# Filtrando os dados para alface (ajuste das condições para não excluir muitos dados)
df_alface = df[
    (df['pH'] >= 5.5) & (df['pH'] <= 7.5) &  # Ajuste do pH
    (df['Nitrogen (mg/kg)'] >= 50) & (df['Nitrogen (mg/kg)'] <= 150) &  # Ajuste de Nitrogênio
    (df['Potassium (mg/kg)'] >= 100) & (df['Potassium (mg/kg)'] <= 300) &  # Ajuste de Potássio
    (df['Temperature Soil (°C)'] >= 10) & (df['Temperature Soil (°C)'] <= 30) &  # Ajuste de Temperatura
    (df['Humidity (%RH)'] >= 60) & (df['Humidity (%RH)'] <= 100)  # Ajuste de Umidade
]

# Verificar se o filtro gerou amostras suficientes
print(f"Número de amostras após o filtro: {len(df_alface)}")

# Verificar novamente as primeiras linhas após o filtro
print(df_alface.head())

# Se houver amostras suficientes, seguir com o treinamento
if len(df_alface) > 0:
    # Configurar o ambiente do PyCaret para classificação
    clf1 = setup(data=df_alface, target='Recommended Fertilizer', session_id=42, normalize=True)

    # Treinar todos os modelos disponíveis
    model = compare_models()

    # Visualizar o desempenho do modelo selecionado
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
    save_model(model, 'fertilizer_classification_model_for_alface')
else:
    print("Não há dados suficientes após o filtro para treinar o modelo.")
