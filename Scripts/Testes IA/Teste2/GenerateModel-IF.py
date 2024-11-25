import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt

# Carregar a base de dados climática
file_path = "Enhanced_Climate_Data.csv"  # Substitua pelo caminho correto do arquivo
data = pd.read_csv(file_path)

# Garantir que a coluna 'date' está no formato datetime
data['date'] = pd.to_datetime(data['date'])

# Normalizar as variáveis climáticas
scaler = StandardScaler()
normalized_data = scaler.fit_transform(data[['temperature', 'humidity', 'precipitation', 'pressure']])
normalized_df = pd.DataFrame(normalized_data, columns=['temperature', 'humidity', 'precipitation', 'pressure'])

# Criar os modelos para cada situação anômala
situations = {
    "Onda de calor": ['temperature'],
    "Chuva extrema": ['precipitation'],
    "Onda de frio": ['temperature']
}

# Resultados
results = {}

# Loop para treinar e prever cada situação
for situation, features in situations.items():
    # Criar os dados de treinamento para as features correspondentes
    X = normalized_df[features]
    
    # Criar o modelo Isolation Forest
    model = IsolationForest(contamination=0.02, random_state=42)
    model.fit(X)
    
    # Prever as anomalias
    data[f'{situation}_anomaly'] = model.predict(X) == -1  # -1 indica anomalia
    
    # Se houver a coluna 'anomaly', avaliar o desempenho
    if 'anomaly' in data.columns:
        true_labels = data['anomaly']
        predicted_labels = data[f'{situation}_anomaly']
        
        print(f"\n--- {situation} ---")
        print("Matriz de Confusão:")
        print(confusion_matrix(true_labels, predicted_labels))
        print("\nRelatório de Classificação:")
        print(classification_report(true_labels, predicted_labels, target_names=["Normal", "Anomaly"]))
    
    # Armazenar os resultados
    results[situation] = data[f'{situation}_anomaly']

# Visualizar as anomalias detectadas
def plot_anomalies(data, situation, feature):
    plt.figure(figsize=(14, 7))
    plt.plot(data['date'], data[feature], label=feature.capitalize(), alpha=0.7)
    
    # Destacar as anomalias detectadas
    anomalies = data[data[f'{situation}_anomaly']]
    plt.scatter(anomalies['date'], anomalies[feature], color='red', label='Detected Anomaly', s=50)
    
    plt.title(f'{feature.capitalize()} Data with {situation} Anomalies')
    plt.xlabel('Date')
    plt.ylabel(feature.capitalize())
    plt.legend()
    plt.grid()
    plt.show()

# Exemplo de visualização
for situation, features in situations.items():
    plot_anomalies(data, situation, features[0])
