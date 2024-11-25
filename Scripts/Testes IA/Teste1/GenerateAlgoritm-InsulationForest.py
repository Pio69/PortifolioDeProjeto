import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import joblib

# Carregar os dados do arquivo CSV
file_path = "Simulated_Climate_Data.csv"
data = pd.read_csv(file_path)

# Garantir que a coluna 'date' está no formato datetime
data['date'] = pd.to_datetime(data['date'])

# Preparar os dados para treinamento (somente a temperatura)
X = data[['temperature']]

# Treinar o modelo Isolation Forest
model = IsolationForest(contamination=0.02, random_state=42)
data['anomaly_score'] = model.fit_predict(X)

# Adicionar a coluna de anomalia predita (1 para normal, -1 para anomalia)
data['predicted_anomaly'] = data['anomaly_score'] == -1

# Simular rótulos reais com base em uma regra simples (método de desvio padrão)
mean_temp = data['temperature'].mean()
std_temp = data['temperature'].std()
threshold_upper = mean_temp + 3 * std_temp
threshold_lower = mean_temp - 3 * std_temp

# Adicionar rótulos reais simulados
data['true_anomaly'] = (data['temperature'] > threshold_upper) | (data['temperature'] < threshold_lower)

# Gerar o relatório de desempenho
true_labels = data['true_anomaly']
predicted_labels = data['predicted_anomaly']

print("Matriz de Confusão:")
print(confusion_matrix(true_labels, predicted_labels))

print("\nRelatório de Classificação:")
print(classification_report(true_labels, predicted_labels, target_names=["Normal", "Anomaly"]))

# Visualizar as anomalias detectadas
def plot_anomalies(data):
    plt.figure(figsize=(14, 7))
    
    # Plotar a temperatura normal
    plt.plot(data['date'], data['temperature'], label='Temperature', alpha=0.7)
    
    # Destacar as anomalias detectadas
    anomalies = data[data['predicted_anomaly']]
    plt.scatter(anomalies['date'], anomalies['temperature'], color='red', label='Predicted Anomaly', s=50)
    
    # Destacar os rótulos reais simulados como anomalias
    true_anomalies = data[data['true_anomaly']]
    plt.scatter(true_anomalies['date'], true_anomalies['temperature'], color='blue', label='True Anomaly', s=50, alpha=0.5)
    
    # Configurar o gráfico
    plt.title('Temperature Data with Anomalies (Detected and True)')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.legend()
    plt.grid()
    plt.show()

# Plotar as anomalias detectadas e os rótulos simulados
plot_anomalies(data)

# Salvar o modelo treinado (opcional)
model_path = "isolation_forest_model.pkl"
joblib.dump(model, model_path)
print(f"Modelo salvo em: {model_path}")
