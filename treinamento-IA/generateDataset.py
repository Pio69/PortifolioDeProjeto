import pandas as pd
import numpy as np

# Gerar dados fictícios
np.random.seed(42)

# Número de amostras
n_samples = 100

# Gerar valores aleatórios para os parâmetros do solo e clima
nitrogen = np.random.randint(10, 100, n_samples)
phosphorus = np.random.randint(5, 30, n_samples)
potassium = np.random.randint(50, 250, n_samples)
ph = np.random.uniform(5.5, 7.5, n_samples)
conductivity = np.random.uniform(1.0, 2.5, n_samples)
temperature_soil = np.random.uniform(18, 30, n_samples)
humidity_soil = np.random.uniform(60, 95, n_samples)
salinity = np.random.randint(50, 200, n_samples)
tds = np.random.randint(200, 500, n_samples)
conductivity_factor = np.random.uniform(0.0, 10.0, n_samples)
salinity_factor = np.random.uniform(0.0, 10.0, n_samples)
feels_like = np.random.uniform(20, 30, n_samples)
temp_min = np.random.uniform(20, 25, n_samples)
temp_max = np.random.uniform(25, 30, n_samples)
pressure = np.random.randint(1000, 1025, n_samples)
humidity_air = np.random.uniform(60, 100, n_samples)

# Gerar as recomendações de fertilizantes com base nos valores
def recommend_fertilizer(row):
    if row['Nitrogen (mg/kg)'] < 30:
        return 'Nitrato de Amônio (NH₄NO₃)'  # Fertilizante rico em Nitrogênio
    elif row['Phosphorus (mg/kg)'] < 15:
        return 'Superfosfato Simples'  # Fertilizante rico em Fósforo
    elif row['Potassium (mg/kg)'] < 100:
        return 'Cloreto de Potássio (KCl)'  # Fertilizante rico em Potássio
    elif row['pH'] < 6.0:
        return 'Enxofre Elementar'  # Para reduzir pH
    elif row['pH'] > 7.0:
        return 'Calcário'  # Para aumentar pH
    else:
        return 'Fertilizante Completo'  # Caso não seja necessário ajuste

# Criar DataFrame com os dados fictícios
data = {
    'Nitrogen (mg/kg)': nitrogen,
    'Phosphorus (mg/kg)': phosphorus,
    'Potassium (mg/kg)': potassium,
    'pH': ph,
    'Conductivity (us/cm)': conductivity,
    'Temperature Soil (°C)': temperature_soil,
    'Humidity (%RH)': humidity_soil,
    'Salinity (mg/L)': salinity,
    'TDS (mg/L)': tds,
    'Conductivity factor (%)': conductivity_factor,
    'Salinity factor (%)': salinity_factor,
    'feels_like': feels_like,
    'temp_min': temp_min,
    'temp_max': temp_max,
    'pressure': pressure,
    'humidity': humidity_air
}

df = pd.DataFrame(data)

# Aplicar a função de recomendação
df['Recommended Fertilizer'] = df.apply(recommend_fertilizer, axis=1)

# Exibir as primeiras linhas do DataFrame
print(df.head())

# Salvar o DataFrame em um arquivo CSV
df.to_csv('fertilizer_recommendations_alface.csv', index=False)
