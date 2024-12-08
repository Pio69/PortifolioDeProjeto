import pandas as pd

# Caminho para o arquivo CSV
file_path = 'extended_simulated_fertilizer_recommendations.csv'

# Ler o arquivo CSV
data = pd.read_csv(file_path)

# Obter os valores únicos da coluna 'Recommended Fertilizer'
unique_fertilizers = data['Recommended Fertilizer'].unique()

# Exibir os valores únicos
print("Recommended Fertilizers (sem repetições):")
for fertilizer in unique_fertilizers:
    print(f"- {fertilizer}")