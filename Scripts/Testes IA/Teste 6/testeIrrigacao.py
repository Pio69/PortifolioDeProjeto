from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Dados simulados
umidade = np.array([30, 50, 70, 20, 80]).reshape(-1, 1)
temperatura = np.array([35, 30, 25, 40, 20]).reshape(-1, 1)
precipitacao = np.array([0, 5, 10, 0, 15]).reshape(-1, 1)
agua = np.array([10, 5, 2, 12, 0])  # Quantidade de água

# Entrada combinada
X = np.hstack((umidade, temperatura, precipitacao))
y = agua

# Dividir os dados para treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treinar o modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Fazer previsões
previsoes = model.predict(X_test)
print(previsoes)
