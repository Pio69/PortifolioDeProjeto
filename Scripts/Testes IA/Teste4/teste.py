import pandas as pd
import matplotlib.pyplot as plt

# Carregar o arquivo CSV
file_path = 'proportional_weather_data.csv'  # Substitua pelo caminho correto se necessário
weather_data = pd.read_csv(file_path)

# Converter a coluna 'recorded_at' para datetime
weather_data['recorded_at'] = pd.to_datetime(weather_data['recorded_at'])

# Verificar as primeiras linhas dos dados
print(weather_data.head())

# Criar gráfico da temperatura ao longo do tempo
plt.figure(figsize=(15, 7))
plt.plot(weather_data['recorded_at'], weather_data['temperature'], label='Temperatura', color='blue', alpha=0.7)

# Configurar o gráfico
plt.title('Temperatura ao Longo do Tempo')
plt.xlabel('Data e Hora')
plt.ylabel('Temperatura (°C)')
plt.xticks(rotation=45)
plt.legend()
plt.tight_layout()

# Exibir o gráfico
plt.show()
