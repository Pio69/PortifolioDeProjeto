import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import confusion_matrix, classification_report, make_scorer
import matplotlib.pyplot as plt
import joblib
import numpy as np

# Carregar os dados do arquivo CSV
file_path = "Simulated_Climate_Data.csv"  # Substitua pelo caminho correto do arquivo
data = pd.read_csv(file_path)

# Garantir que a coluna 'date' está no formato datetime
data['date'] = pd.to_datetime(data['date'])

# Normalizar a temperatura usando StandardScaler
scaler = StandardScaler()
data['temperature_normalized'] = scaler.fit_transform(data[['temperature']])

# Preparar os dados para treinamento
X = data[['temperature_normalized']]

# Função de scoring personalizada (maior média de pontuação indica melhor modelo)
def custom_scoring(estimator, X):
    scores = estimator.decision_function(X)
    return np.mean(scores)

scorer = make_scorer(custom_scoring, greater_is_better=True, needs_proba=False)

# Configurar a busca pelos melhores hiperparâmetros
param_dist = {
    'n_estimators': [50, 100, 150],
    'max_samples': [0.5, 0.75, 1.0],
    'contamination': [0.05, 0.1],  # Tentar 5% ou 10%
    'random_state': [42]
}


# Instanciar o modelo base
isolation_forest = IsolationForest()

# Configurar o RandomizedSearchCV
random_search = RandomizedSearchCV(
    isolation_forest,
    param_distributions=param_dist,
    n_iter=10,
    scoring=scorer,  # Métrica customizada
    cv=3,
    random_state=42,
    verbose=1
)

# Ajustar o modelo
random_search.fit(X)

# Melhor modelo
best_model = random_search.best_estimator_
print(f"Melhores Hiperparâmetros: {random_search.best_params_}")

# Usar o modelo ajustado para prever as anomalias
data['anomaly_score'] = best_model.fit_predict(X)
data['predicted_anomaly'] = data['anomaly_score'] == -1

# Verificar se a coluna 'anomaly' está presente para avaliação
if 'anomaly' in data.columns:
    true_labels = data['anomaly']
    predicted_labels = data['predicted_anomaly']

    print("Matriz de Confusão:")
    print(confusion_matrix(true_labels, predicted_labels))

    print("\nRelatório de Classificação:")
    print(classification_report(true_labels, predicted_labels, target_names=["Normal", "Anomaly"]))
else:
    print("A coluna 'anomaly' não está presente. Avaliação com rótulos reais não será realizada.")

# Visualizar as anomalias detectadas
def plot_anomalies(data):
    plt.figure(figsize=(14, 7))
    
    # Plotar a temperatura normal
    plt.plot(data['date'], data['temperature'], label='Temperature', alpha=0.7)
    
    # Destacar as anomalias detectadas
    anomalies = data[data['predicted_anomaly']]
    plt.scatter(anomalies['date'], anomalies['temperature'], color='red', label='Predicted Anomaly', s=50)
    
    # Caso a coluna 'anomaly' exista, destacar as anomalias reais
    if 'anomaly' in data.columns:
        true_anomalies = data[data['anomaly']]
        plt.scatter(true_anomalies['date'], true_anomalies['temperature'], color='blue', label='True Anomaly', s=50, alpha=0.5)
    
    # Configurar o gráfico
    plt.title('Temperature Data with Anomalies (Detected and True, if available)')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.legend()
    plt.grid()
    plt.show()

# Plotar as anomalias detectadas e, se disponível, os rótulos reais
plot_anomalies(data)

# Salvar o modelo ajustado
model_path = "isolation_forest_tuned_model.pkl"
joblib.dump(best_model, model_path)
print(f"Modelo ajustado salvo em: {model_path}")
