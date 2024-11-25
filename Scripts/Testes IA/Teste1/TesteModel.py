import pandas as pd
import joblib

# Caminho para o arquivo do modelo Isolation Forest (.pkl)
model_path = "isolation_forest_model.pkl"  # Atualize com o caminho correto na sua máquina

# Caminho para o arquivo CSV Simulated Climate Data
csv_path = "Simulated_Climate_Data.csv"  # Atualize com o caminho correto na sua máquina

# Caminho para salvar o CSV com os resultados
output_path = "Simulated_Climate_Data_Anomalies.csv"

# Carregar o modelo salvo
try:
    model = joblib.load(model_path)
    print("Modelo carregado com sucesso!")
except FileNotFoundError:
    print(f"Erro: Não foi possível encontrar o arquivo de modelo em {model_path}")
    exit()

# Carregar o arquivo CSV
try:
    data = pd.read_csv(csv_path)
    print("Arquivo CSV carregado com sucesso!")
except FileNotFoundError:
    print(f"Erro: Não foi possível encontrar o arquivo CSV em {csv_path}")
    exit()

# Garantir que a coluna 'date' está no formato datetime
if 'date' in data.columns:
    data['date'] = pd.to_datetime(data['date'])

# Verificar se a coluna 'temperature' está presente
if 'temperature' in data.columns:
    # Preparar os dados para detecção de anomalias
    X = data[['temperature']]
    
    # Fazer previsões usando o modelo
    data['anomaly_score'] = model.predict(X)
    data['predicted_anomaly'] = data['anomaly_score'] == -1  # -1 indica anomalia no Isolation Forest

    # Salvar os resultados em um novo arquivo CSV
    data.to_csv(output_path, index=False)
    print(f"Resultados salvos em: {output_path}")
else:
    print("Erro: A coluna 'temperature' não foi encontrada no arquivo CSV.")
