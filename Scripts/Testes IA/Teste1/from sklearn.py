import pandas as pd
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
import numpy as np

# Carregar os dados do arquivo CSV
file_path = "./Teste1/Enhanced_Climate_Data.csv"  # Substitua pelo caminho correto do arquivo
data = pd.read_csv(file_path)

# Garantir que a coluna 'date' está no formato datetime
data['date'] = pd.to_datetime(data['date'])

# Normalizar a temperatura usando StandardScaler
scaler = StandardScaler()
data['temperature_normalized'] = scaler.fit_transform(data[['temperature']])

# Preparar os dados para treinamento
X = data[['temperature_normalized']]

# Instanciar o modelo LOF
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.07)  # Ajuste a contaminação conforme necessário

# Ajustar e prever as anomalias
data['lof_anomaly_score'] = lof.fit_predict(X)
data['lof_predicted_anomaly'] = data['lof_anomaly_score'] == -1

# Verificar se a coluna 'anomaly' está presente para avaliação
if 'anomaly' in data.columns:
    true_labels = data['anomaly']
    predicted_labels = data['lof_predicted_anomaly']

    print("Matriz de Confusão LOF:")
    print(confusion_matrix(true_labels, predicted_labels))

    print("\nRelatório de Classificação LOF:")
    print(classification_report(true_labels, predicted_labels, target_names=["Normal", "Anomaly"]))
else:
    print("A coluna 'anomaly' não está presente. Avaliação com rótulos reais não será realizada.")

# Visualizar as anomalias detectadas
def plot_anomalies(data):
    # Calcular a média e o desvio padrão da temperatura
    mean_temp = data['temperature'].mean()
    std_temp = data['temperature'].std()

    # Criar o gráfico com as linhas de desvio padrão
    plt.figure(figsize=(14, 7))

    # Linha de temperatura
    plt.plot(data['date'], data['temperature'], label='Temperature', alpha=0.7, color='blue')

    # Linhas de média e desvios padrão
    plt.axhline(mean_temp, color='green', linestyle='--', linewidth=1, label='Mean')
    plt.axhline(mean_temp + std_temp, color='orange', linestyle='--', linewidth=1, label='+1 Std Dev')
    plt.axhline(mean_temp - std_temp, color='orange', linestyle='--', linewidth=1, label='-1 Std Dev')

    # Destacar as anomalias detectadas
    anomalies = data[data['lof_predicted_anomaly']]
    plt.scatter(anomalies['date'], anomalies['temperature'], color='red', label='Heatwave Anomaly', s=50)

    # Configurar o gráfico
    plt.title('Temperature Data with Heatwave Anomalies and Standard Deviation')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.legend(loc='upper left')
    plt.grid()
    plt.show()


# Plotar as anomalias detectadas e, se disponível, os rótulos reais
plot_anomalies(data)
