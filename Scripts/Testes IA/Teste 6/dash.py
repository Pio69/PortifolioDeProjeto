import streamlit as st

st.title("Previsão de Irrigação Inteligente")
umidade = st.slider("Umidade do Solo (%)", 0, 100, 50)
temperatura = st.slider("Temperatura (°C)", 10, 40, 25)
precipitacao = st.slider("Precipitação (mm)", 0, 50, 5)

# Simular um cálculo básico
agua = max(0, 10 - umidade * 0.1 + temperatura * 0.2 - precipitacao * 0.3)
st.write(f"Quantidade sugerida de água: {agua:.2f} L/m²")
