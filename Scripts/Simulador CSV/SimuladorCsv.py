import pandas as pd
import mysql.connector
from mysql.connector import Error

# Configuração do banco de dados
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "admin",
    "database": "smartlettuce"
}

# Caminho para o arquivo CSV
file_path = "Adjusted_Measurements_for_1_Month.csv"

# Função para inserir dados na tabela tb_measures
def insert_measures(data):
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        print("conectou")

        # Query SQL para inserção
        insert_query = """
            INSERT INTO tb_measures (
                id, Nitrogen, Phosphorus, Potassium, pH, Conductivity, Temperature, Humidity, device_id, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Inserir cada linha no banco de dados
        for _, row in data.iterrows():
            cursor.execute(insert_query, tuple(row))

        # Confirmar as mudanças
        connection.commit()
        print(f"{cursor.rowcount} registros inseridos com sucesso.")

    except Error as e:
        print(f"Erro ao inserir dados: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Conexão ao banco de dados fechada.")

# Carregar os dados do CSV
data = pd.read_csv(file_path)

print("vai inserir")
# Inserir os dados na tabela
insert_measures(data)
