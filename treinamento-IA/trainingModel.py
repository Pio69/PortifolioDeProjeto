import pandas as pd
from pycaret.classification import *

# Carregar a base de treinamento
df = pd.read_csv("fertilizer_training_data.csv")

# Configurar o PyCaret para classificação
# 'Recommended Fertilizer' é a coluna-alvo
setup(
    data=df,
    target="Recommended Fertilizer",  # Coluna alvo
    session_id=42,  # Para reprodutibilidade
    normalize=True,  # Normalizar os dados numéricos
    categorical_features=[],  # Sem variáveis categóricas neste caso
    numeric_features=[
        "Nitrogen (mg/kg)",
        "Phosphorus (mg/kg)",
        "Potassium (mg/kg)",
        "pH",
        "Conductivity (us/cm)",
        "Temperature (°C)",
        "Humidity (%RH)",
        "Salinity (mg/L)",
        "TDS (mg/L)",
        "Conductivity factor (%)",
        "Salinity factor (%)",
        "feels_like",
        "temp_min",
        "temp_max",
        "pressure",
        "humidity",
    ],
)

# Comparar modelos e escolher o melhor
best_model = compare_models()

# Criar o modelo baseado no melhor encontrado
final_model = create_model(best_model)

# Afinar o modelo para melhores resultados
tuned_model = tune_model(final_model)

# Finalizar o modelo para uso em produção
final_model = finalize_model(tuned_model)

# Avaliar o modelo
evaluate_model(final_model)

# Salvar o modelo treinado
save_model(final_model, "fertilizer_recommendation_model")

print("Modelo treinado e salvo como 'fertilizer_recommendation_model.pkl'")
