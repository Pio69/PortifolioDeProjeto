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
    adjusted_ph = adjust_ph_due_to_temperature(row['pH'], row['Temperature (°C)'])
    
    # Definir as faixas ideais para cada parâmetro
    ideal_conditions = {
        'pH': (6.0, 7.0),
        'Nitrogen (mg/kg)': (70, 100),
        'Phosphorus (mg/kg)': (15, 30),
        'Potassium (mg/kg)': (150, 250),
        'Temperature (°C)': (15, 25),
        'Humidity (%RH)': (70, 90)
    }

    # Verificar se os valores estão dentro dos intervalos ideais
    actions = []
    fertilizer_needed = []
    
    # Verificação de pH
    if adjusted_ph < ideal_conditions['pH'][0] or adjusted_ph > ideal_conditions['pH'][1]:
        actions.append("Ajustar pH do solo")
        if adjusted_ph < 6.0:
            fertilizer_needed.append("Enxofre (Sulfato de ferro ou enxofre elementar) - Fertilizante para diminuir pH")
        elif adjusted_ph > 7.0:
            fertilizer_needed.append("Calagem (Óxido de cálcio, calcário dolomítico) - Fertilizante para aumentar pH")
    
    # Verificação de Nitrogênio
    if row['Nitrogen (mg/kg)'] < ideal_conditions['Nitrogen (mg/kg)'][0]:
        actions.append("Adicionar Nitrogênio ao solo")
        fertilizer_needed.append("Nitrato de Amônio (NH₄NO₃) ou Ureia (CO(NH₂)₂) - Fertilizante rico em Nitrogênio")
    
    # Verificação de Fósforo
    if row['Phosphorus (mg/kg)'] < ideal_conditions['Phosphorus (mg/kg)'][0]:
        actions.append("Adicionar Fósforo ao solo")
        fertilizer_needed.append("Superfosfato Simples (Ca(H₂PO₄)₂) - Fertilizante rico em Fósforo")
    
    # Verificação de Potássio
    if row['Potassium (mg/kg)'] < ideal_conditions['Potassium (mg/kg)'][0]:
        actions.append("Adicionar Potássio ao solo")
        fertilizer_needed.append("Cloreto de Potássio (KCl) ou Sulfato de Potássio (K₂SO₄) - Fertilizante rico em Potássio")
    
    # Verificação de Temperatura
    if row['Temperature (°C)'] < ideal_conditions['Temperature (°C)'][0]:
        actions.append("Aumentar a temperatura do solo")
    elif row['Temperature (°C)'] > ideal_conditions['Temperature (°C)'][1]:
        actions.append("Diminuir a temperatura do solo")
    
    # Verificação de Umidade
    if row['Humidity (%RH)'] < ideal_conditions['Humidity (%RH)'][0]:
        actions.append("Aumentar a umidade do solo")
        fertilizer_needed.append("Hidrogéis ou Fertilizantes Orgânicos com alta capacidade de retenção de água - Fertilizante com capacidade de retenção de água")
    elif row['Humidity (%RH)'] > ideal_conditions['Humidity (%RH)'][1]:
        actions.append("Reduzir a umidade do solo")
    
    # Decisão final sobre o fertilizante
    if not fertilizer_needed:
        fertilizer_needed.append("Fertilizante Completo para Alface (NPK 10-10-10 ou NPK 20-20-20)")

    return ', '.join(fertilizer_needed), ', '.join(actions)

# Carregar o CSV de treinamento
file_path = "fertilizer_training_data.csv"
df = pd.read_csv(file_path)

# Aplicar a função de recomendação para cada linha do DataFrame
df['Recommended Fertilizer'], df['Recommended Action'] = zip(*df.apply(cross_data_for_ideal_fertilizer, axis=1))

# Salvar o DataFrame atualizado no mesmo arquivo CSV
df.to_csv(file_path, index=False)

# Exibir as primeiras linhas do DataFrame para verificação
print(df.head())
