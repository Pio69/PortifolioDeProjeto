import pandas as pd
import mysql.connector
from mysql.connector import Error
from datetime import datetime

# Configuração do banco de dados
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'admin',
    'database': 'smartlettuce'
}

def parse_datetime(date_string):
    """
    Tenta converter uma string de data para datetime considerando múltiplos formatos.
    """
    formats = ['%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d %H:%M:%S']
    for fmt in formats:
        try:
            return datetime.strptime(date_string, fmt)
        except ValueError:
            continue
    raise ValueError(f"Formato de data/hora inválido: {date_string}")

def insert_measures():
    try:
        print('Conectando ao banco de dados...')
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor()

        print('Conexão estabelecida com sucesso!')

        # Carregar os dados do arquivo CSV
        file_path = "Adjusted_Measurements_with_1_Hour_Interval.csv"
        data = pd.read_csv(file_path)

        # Preparar a query de inserção
        insert_query = """
            INSERT INTO tb_measures (
                id, Nitrogen, Phosphorus, Potassium, pH, Conductivity, Temperature, Humidity, device_id, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Inserir os dados na tabela
        print(f'Inserindo {len(data)} registros...')
        for _, row in data.iterrows():
            try:
                cursor.execute(insert_query, (
                    row['id'],
                    row['Nitrogen'],
                    row['Phosphorus'],
                    row['Potassium'],
                    row['pH'],
                    row['Conductivity'],
                    row['Temperature'],
                    row['Humidity'],
                    row['device_id'],
                    parse_datetime(row['created_at'])
                ))
            except ValueError as ve:
                print(f"Erro ao processar registro {row['id']}: {ve}")

        # Confirmar as alterações
        cnx.commit()
        print('Dados inseridos com sucesso.')

    except Error as e:
        print('Erro ao conectar ou inserir dados no banco:', e)
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'cnx' in locals() and cnx.is_connected():
            cnx.close()
        print('Conexão ao banco de dados encerrada.')

# Executar a inserção
if __name__ == '__main__':
    insert_measures()
