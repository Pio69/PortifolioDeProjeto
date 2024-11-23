import random
from datetime import datetime, timedelta

# Função para gerar uma simulação de valores de sensores ao longo de um dia
def generate_sensor_data():
    base_time = datetime(2024, 10, 6, 0, 0, 0)  # Data de início
    device_id = 1  # Assumindo que todos os dados vêm de um dispositivo (pode ajustar se houver mais)
    
    temperature = 15  # Temperatura inicial
    humidity = 80  # Umidade inicial

    inserts = []
    
    for i in range(96):  # 96 medições para 24h (a cada 15 minutos)
        current_time = base_time + timedelta(minutes=15 * i)
        
        # Simulação de temperatura e umidade ao longo do dia
        hour = current_time.hour
        if 6 <= hour <= 18:
            temperature += random.uniform(0.1, 0.5)  # Temperatura aumenta durante o dia
            humidity -= random.uniform(0.1, 0.3)  # Umidade diminui durante o dia
        else:
            temperature -= random.uniform(0.1, 0.5)  # Temperatura cai durante a noite
            humidity += random.uniform(0.1, 0.3)  # Umidade sobe durante a noite

        # Limitação dos valores dentro de faixas razoáveis
        temperature = max(10, min(temperature, 35))
        humidity = max(30, min(humidity, 100))
        
        # Simulação de outros valores
        soil_moisture = random.uniform(30, 50)  # Umidade do solo (30% - 50%)
        ph = random.uniform(6.5, 7.5)  # pH (6.5 - 7.5)
        npk_nitrogen = random.uniform(15, 25)  # Nitrogênio (15 - 25)
        npk_phosphorus = random.uniform(10, 20)  # Fósforo (10 - 20)
        npk_potassium = random.uniform(15, 30)  # Potássio (15 - 30)

        # Gerar dados para diferentes tipos de sensores
        sensor_data = [
            {"sensor_type": "Temperature", "sensor_value": temperature},
            {"sensor_type": "Humidity", "sensor_value": humidity},
            {"sensor_type": "SoilMoisture", "sensor_value": soil_moisture},
            {"sensor_type": "pH", "sensor_value": ph},
            {"sensor_type": "NPKNitrogen", "sensor_value": npk_nitrogen},
            {"sensor_type": "NPKPhosphorus", "sensor_value": npk_phosphorus},
            {"sensor_type": "NPKPotassium", "sensor_value": npk_potassium}
        ]

        for data in sensor_data:
            # Geração de comando SQL INSERT
            insert_query = f"""
            INSERT INTO sensor_data (sensor_value, sensor_type, data, device_id)
            VALUES ({data['sensor_value']:.2f}, '{data['sensor_type']}', '{current_time.strftime('%Y-%m-%d %H:%M:%S')}', {device_id});
            """
            inserts.append(insert_query)
    
    return inserts

# Gera os dados e imprime os comandos SQL
insert_statements = generate_sensor_data()
for insert in insert_statements:
    print(insert)
