import pandas as pd
import numpy as np

# Função para ajustar pH devido à temperatura
def adjust_ph_due_to_temperature(pH, temperature):
    if temperature < 18:  # Temperatura muito baixa
        if pH > 6.5:
            return pH + 0.2  # Ajuste para mais alcalino
        else:
            return pH  # Pouco impacto se já for ácido
    elif temperature > 24:  # Temperatura muito alta
        if pH < 6.5:
            return pH - 0.2  # Ajuste para mais ácido
        else:
            return pH  # Pouco impacto se já for alcalino
    else:
        return pH  # Temperatura ideal, sem ajuste

# Função para cruzar dados e determinar o fertilizante ideal
def cross_data_for_ideal_fertilizer(row):
    # Ajustar pH com base na temperatura
    adjusted_ph = adjust_ph_due_to_temperature(row['pH'], row['Temperature Soil (°C)'])
    
    # Definir as faixas ideais para cada parâmetro
    ideal_conditions = {
        'pH': (6.0, 7.0),
        'Nitrogen (mg/kg)': (70, 100),
        'Phosphorus (mg/kg)': (15, 30),
        'Potassium (mg/kg)': (150, 250),
        'Temperature Soil (°C)': (15, 25),
        'Humidity (%RH)': (70, 90)
    }

    # Inicializar a variável para o fertilizante recomendado
    recommended_fertilizer = "Fertilizante Completo para Alface (NPK 10-10-10 ou NPK 20-20-20)"
    
    # Verificação de pH
    if adjusted_ph < ideal_conditions['pH'][0]:
        recommended_fertilizer = "Enxofre Elementar (Sulfato de ferro ou enxofre elementar) - Fertilizante para diminuir pH"
    elif adjusted_ph > ideal_conditions['pH'][1]:
        recommended_fertilizer = "Calcário (Óxido de cálcio, calcário dolomítico) - Fertilizante para aumentar pH"
    
    # Verificação de Nitrogênio
    elif row['Nitrogen (mg/kg)'] < ideal_conditions['Nitrogen (mg/kg)'][0]:
        recommended_fertilizer = "Nitrato de Amônio (NH₄NO₃) ou Ureia (CO(NH₂)₂) - Fertilizante rico em Nitrogênio"
    
    # Verificação de Fósforo
    elif row['Phosphorus (mg/kg)'] < ideal_conditions['Phosphorus (mg/kg)'][0]:
        recommended_fertilizer = "Superfosfato Simples (Ca(H₂PO₄)₂) - Fertilizante rico em Fósforo"
    
    # Verificação de Potássio
    elif row['Potassium (mg/kg)'] < ideal_conditions['Potassium (mg/kg)'][0]:
        recommended_fertilizer = "Cloreto de Potássio (KCl) ou Sulfato de Potássio (K₂SO₄) - Fertilizante rico em Potássio"
    
    return recommended_fertilizer

# Carregar o CSV de treinamento
file_path = "fertilizer_recommendations_alface.csv"
df = pd.read_csv(file_path)

# Aplicar a função de recomendação para cada linha do DataFrame
df['Recommended Fertilizer'] = df.apply(cross_data_for_ideal_fertilizer, axis=1)

# Salvar o DataFrame atualizado no mesmo arquivo CSV
df.to_csv(file_path, index=False)

# Exibir as primeiras linhas do DataFrame para verificação
print(df.head())
