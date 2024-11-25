import pandas as pd
from sklearn.svm import OneClassSVM
from sklearn.model_selection import ParameterGrid
import numpy as np
import joblib
import matplotlib.pyplot as plt

# Carregar os dados do arquivo CSV
file_path = "Simulated_Climate_Data.csv"
data = pd.read_csv(file_path)

# Garantir que a coluna 'date' está no formato datetime
if 'date' in data.columns:
    data['date'] = pd.to_datetime(data['date'])

# Verificar se a coluna 'anomaly' está presente para treinamento
if 'anomaly' not in data.columns:
    raise ValueError("O CSV precisa conter a coluna 'anomaly' para treinar o modelo.")

# Separar os dados de treinamento (apenas registros normais)
X_train = data[['temperature']]
y_train = data['anomaly']
X_train_normal = X_train[y_train == False]  # Treinar apenas com dados normais

# Definir os hiperparâmetros para o GridSearch (manualmente)
param_grid = {
    'nu': [0.01, 0.05, 0.1],
    'kernel': ['linear', 'rbf', 'poly'],
    'gamma': ['scale', 'auto', 0.1, 1, 10]
}

# Tunagem manual do modelo usando ParameterGrid
best_model = None
best_score = float('-inf')
best_params = None

print("Executando busca manual de parâmetros...")

for params in ParameterGrid(param_grid):
    model = OneClassSVM(**params)
    model.fit(X_train_normal)
    
    # Avaliar o modelo usando a média dos scores
    scores = model.score_samples(X_train_normal)
    avg_score = np.mean(scores)
    
    if avg_score > best_score:
        best_score = avg_score
        best_model = model
        best_params = params

print("Melhores parâmetros encontrados:", best_params)

# Salvar o modelo treinado
model_path = "one_class_svm_model.pkl"
joblib.dump(best_model, model_path)
print(f"Modelo salvo em: {model_path}")

# Simular o uso do modelo em um dataset sem a coluna 'anomaly'
data_no_anomaly = data[['date', 'temperature']].copy()  # Simular arquivo sem 'anomaly'
data_no_anomaly['anomaly_score'] = best_model.predict(data_no_anomaly[['temperature']])
data_no_anomaly['predicted_anomaly'] = data_no_anomaly['anomaly_score'] == -1  # -1 indica anomalia

# Salvar os resultados em um novo arquivo CSV
output_path = "Simulated_Climate_Data_Predictions.csv"
data_no_anomaly.to_csv(output_path, index=False)
print(f"Resultados salvos em: {output_path}")

# Visualizar as anomalias detectadas
def plot_anomalies(data, predictions):
    plt.figure(figsize=(14, 7))
    
    # Plotar a temperatura normal
    plt.plot(data['date'], data['temperature'], label='Temperature', alpha=0.7)
    
    # Destacar as anomalias detectadas
    anomalies = predictions[predictions['predicted_anomaly']]
    plt.scatter(anomalies['date'], anomalies['temperature'], color='red', label='Predicted Anomaly', s=50)
    
    # Configurar o gráfico
    plt.title('Temperature Data with Detected Anomalies')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.legend()
    plt.grid()
    plt.show()

# Plotar as anomalias detectadas
plot_anomalies(data_no_anomaly, data_no_anomaly)
