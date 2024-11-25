import pandas as pd
import matplotlib.pyplot as plt

# Função para detectar anomalias
def detect_anomalies(data, window=7, threshold=3):
    # Adicionar uma média móvel e desvio padrão
    data['rolling_mean'] = data['temperature'].rolling(window=window).mean()
    data['rolling_std'] = data['temperature'].rolling(window=window).std()
    
    # Detectar anomalias com base no desvio padrão
    data['anomaly'] = abs(data['temperature'] - data['rolling_mean']) > threshold * data['rolling_std']
    
    # Classificar as anomalias como ondas de calor ou frio
    data['event'] = 'normal'
    data.loc[data['anomaly'] & (data['temperature'] > data['rolling_mean']), 'event'] = 'heat_wave'
    data.loc[data['anomaly'] & (data['temperature'] < data['rolling_mean']), 'event'] = 'cold_wave'
    
    return data

# Função para visualizar os dados e anomalias
def plot_anomalies(data):
    plt.figure(figsize=(14, 7))
    
    # Plotar a temperatura normal
    plt.plot(data['date'], data['temperature'], label='Temperature', alpha=0.7)
    
    # Destacar ondas de calor
    heat_waves = data[data['event'] == 'heat_wave']
    plt.scatter(heat_waves['date'], heat_waves['temperature'], color='red', label='Heat Wave', s=50)
    
    # Destacar ondas de frio
    cold_waves = data[data['event'] == 'cold_wave']
    plt.scatter(cold_waves['date'], cold_waves['temperature'], color='blue', label='Cold Wave', s=50)
    
    # Configurar o gráfico
    plt.title('Temperature Data with Anomalies')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.legend()
    plt.grid()
    plt.show()

# Carregar os dados do arquivo CSV
file_path = "Simulated_Climate_Data.csv"
simulated_data = pd.read_csv(file_path)

# Converter a coluna de datas para o tipo datetime
simulated_data['date'] = pd.to_datetime(simulated_data['date'])

# Detectar anomalias e classificar eventos
analyzed_data = detect_anomalies(simulated_data)

# Plotar os resultados
plot_anomalies(analyzed_data)
