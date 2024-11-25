import mysql.connector
from mysql.connector import errorcode
from faker import Faker
import random
from datetime import datetime, timedelta

# Configurações de conexão com o banco de dados
db_config = {
    'user': 'root',
    'password': 'admin',
    'host': 'localhost',
    'database': 'smartlettuce',
}

# Inicializar o Faker
faker = Faker()

# Função para gerar uma direção do vento aleatória
def get_random_wind_direction():
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return random.choice(directions)

# Função para gerar dados climáticos aleatórios
def generate_climate_data(recorded_at, location=None):
    if location is None:
        location = faker.city()
    return {
        'temperature': round(random.uniform(0, 35), 2),  # 0°C a 35°C
        'humidity': round(random.uniform(20, 100), 2),   # 20% a 100%
        'wind_speed': round(random.uniform(0, 100), 2),  # 0 km/h a 100 km/h
        'wind_direction': get_random_wind_direction(),
        'pressure': round(random.uniform(980, 1050), 2), # 980 hPa a 1050 hPa
        'rainfall': round(random.uniform(0, 200), 2),    # 0 mm a 200 mm
        'uv_index': round(random.uniform(0, 15), 2),     # 0 a 15
        'recorded_at': recorded_at,
        'location': location,
    }

def populate_data():
    try:
        # Conectar ao banco de dados
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor()

        print('Conectado ao banco de dados.')

        # Data atual
        end_date = datetime.now()
        # Data de dois meses atrás
        start_date = end_date - timedelta(days=60)

        # Gerar uma lista de datas entre start_date e end_date
        delta = end_date - start_date
        dates = [start_date + timedelta(days=i) for i in range(delta.days + 1)]

        print(f'Gerando dados para {len(dates)} dias.')

        # Preparar a query de inserção
        insert_query = (
            "INSERT INTO climate_data "
            "(temperature, humidity, wind_speed, wind_direction, pressure, rainfall, uv_index, recorded_at, location) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )

        # Inserir dados para cada data
        for date in dates:
            data = generate_climate_data(date)
            values = (
                data['temperature'],
                data['humidity'],
                data['wind_speed'],
                data['wind_direction'],
                data['pressure'],
                data['rainfall'],
                data['uv_index'],
                data['recorded_at'],
                data['location'],
            )
            cursor.execute(insert_query, values)

        # Confirmar as alterações
        cnx.commit()
        print('Dados inseridos com sucesso.')

    except mysql.connector.Error as err:
        print('Erro ao conectar ao banco de dados:', err)
    finally:
        # Fechar a conexão
        if cnx.is_connected():
            cursor.close()
            cnx.close()
            print('Conexão ao banco de dados encerrada.')

if __name__ == '__main__':
    populate_data()
