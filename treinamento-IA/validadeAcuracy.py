import pandas as pd
from pycaret.classification import *

# Carregar o dataset para teste
df_test = pd.read_csv('fertilizer_recommendations_alface.csv')

# Excluir a coluna 'Recommended Fertilizer' para que o modelo faça a previsão
df_test_without_fertilizer = df_test.drop(columns=['Recommended Fertilizer'])

# Carregar o modelo treinado salvo
model = load_model('fertilizer_classification_model_for_alface')

# Fazer previsões com o modelo treinado
predictions = predict_model(model, data=df_test_without_fertilizer)

# Exibir as colunas de 'predictions' para verificar o nome correto da coluna de predições
print(predictions.columns)

# Ajustando para usar a coluna correta com as predições
# Supondo que o nome da coluna com as predições seja 'prediction_label' ou algo similar
df_test['Predicted Fertilizer'] = predictions['prediction_label']  # Ajuste conforme o nome correto

# Comparação com a coluna original 'Recommended Fertilizer'
comparison_df = df_test[['Recommended Fertilizer', 'Predicted Fertilizer']]

# Mostrar a comparação
print(comparison_df.head())

# Calcular a taxa de acerto entre as previsões do modelo e a coluna original 'Recommended Fertilizer'
accuracy = (comparison_df['Recommended Fertilizer'] == comparison_df['Predicted Fertilizer']).mean()
print(f'Acurácia do modelo: {accuracy * 100:.2f}%')
