import pandas as pd
from pycaret.anomaly import setup, create_model, assign_model

# Carregar os dados
data = pd.read_csv('./climate_anomaly_data.csv')

# Configuração do ambiente de modelagem
anomaly_setup = setup(data, session_id=123, silent=True, verbose=False)

# Criar um modelo de detecção de anomalias (Isolation Forest, por padrão)
model = create_model('iforest')

# Identificar anomalias no conjunto de dados
results = assign_model(model)

# Visualizar os resultados
print(results.head())

# Salvar o modelo treinado
from pycaret.anomaly import save_model
save_model(model, 'climate_anomaly_model')

# Exportar os resultados com as anomalias identificadas
results.to_csv('export_climate_anomaly_results.csv', index=False)
