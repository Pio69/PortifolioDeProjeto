import paho.mqtt.client as mqtt
import mysql.connector
import json
from datetime import datetime

# Função chamada quando uma mensagem é recebida
def on_message(client, userdata, message):
    topic = message.topic  # Exemplo: 'measure/sensor/DEVICE_ID'
    payload = message.payload.decode('utf-8').strip()

    if "info" in topic:
        # Apenas imprime no console o payload recebido no tópico `/info`
        print(f"Tópico {topic}: {payload}")
        return

    db_connection = userdata  # Obter a conexão do banco de dados do userdata

    try:
        device_id = int(topic.split('/')[-2])  # Extrair DEVICE_ID do tópico
    except ValueError as e:
        print(f"ID do dispositivo inválido: {e}")
        return

    try:
        # Tenta carregar o payload como JSON
        sensor_data = json.loads(payload)
    except json.JSONDecodeError as e:
        print(f"Erro ao parsear o JSON do payload: {e}")
        return

    # Verificar se todos os campos obrigatórios estão presentes
    required_fields = [
        'Nitrogen', 'Phosphorus', 'Potassium', 'pH',
        'Conductivity', 'Temperature', 'Humidity', 'Salinity', 'TDS'
    ]
    if not all(field in sensor_data for field in required_fields):
        print(f"Dados incompletos no payload: {sensor_data}")
        return

    # Inserir os dados no banco de dados
    cursor = db_connection.cursor()
    sql = """
        INSERT INTO tb_measures (
            Nitrogen, Phosphorus, Potassium, pH, Conductivity,
            Temperature, Humidity, Salinity, TDS, device_id, created_at
        ) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        sensor_data['Nitrogen'],
        sensor_data['Phosphorus'],
        sensor_data['Potassium'],
        sensor_data['pH'],
        sensor_data['Conductivity'],
        sensor_data['Temperature'],
        sensor_data['Humidity'],
        sensor_data['Salinity'],
        sensor_data['TDS'],
        device_id,
        datetime.now()  # Usa o horário atual para `created_at`
    )
    try:
        cursor.execute(sql, values)
        db_connection.commit()
        print(f"Dados inseridos para device_id {device_id}: {sensor_data}")
    except mysql.connector.Error as e:
        print(f"Erro no MySQL: {e}")
        db_connection.rollback()
    finally:
        cursor.close()

# Configura o cliente MQTT para escutar os tópicos
def subscribe_to_sensors():
    # Cria um cliente MQTT
    client = mqtt.Client()

    # Conecta ao servidor Mosquitto (localhost no caso)
    client.connect("localhost", 1883, 60)

    # Cria a conexão com o banco de dados
    db_connection = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="admin",
        database="smartlettuce"
    )

    # Define a função de callback para quando uma mensagem for recebida
    client.on_message = on_message

    # Define o db_connection como userdata
    client.user_data_set(db_connection)

    # Inscreve-se nos tópicos measure/sensor/+/measures e measure/sensor/+/info
    client.subscribe("measure/sensor/+/measures")
    client.subscribe("measure/sensor/+/info")

    # Loop para manter a conexão ativa e escutar as mensagens
    try:
        client.loop_forever()
    except KeyboardInterrupt:
        print("Desconectando...")
    finally:
        # Fecha a conexão com o banco de dados ao sair
        db_connection.close()

if __name__ == "__main__":
    subscribe_to_sensors()
