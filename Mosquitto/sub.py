import paho.mqtt.client as mqtt
import mysql.connector
import re

# Função chamada quando uma mensagem é recebida
def on_message(client, userdata, message):
    db_connection = userdata  # Obter a conexão do banco de dados do userdata
    topic = message.topic  # 'measure/sensor/DEVICE_ID'
    try:
        device_id = int(topic.split('/')[-1])
    except ValueError as e:
        print(f"ID do dispositivo inválido: {e}")
        return
    payload = message.payload.decode('utf-8').strip()
    
    # Remover as chaves { } se existirem
    if payload.startswith('{') and payload.endswith('}'):
        payload = payload[1:-1]
    
    # Parsear o payload manualmente
    try:
        # Usar expressão regular para extrair pares chave:valor
        pattern = r'(\w+):([0-9.]+)'
        matches = re.findall(pattern, payload)
        if not matches:
            print("Nenhum dado encontrado no payload.")
            return
        sensor_data = {}
        for key, value in matches:
            sensor_data[key.strip()] = float(value.strip())
    except Exception as e:
        print(f"Erro ao parsear o payload: {e}")
        return
    
    # Inserir cada sensor_type e sensor_value no banco de dados
    cursor = db_connection.cursor()
    sql = "INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (%s, %s, %s)"
    for sensor_type, sensor_value in sensor_data.items():
        values = (sensor_value, sensor_type, device_id)
        try:
            cursor.execute(sql, values)
            db_connection.commit()
            print(f"Dado inserido: {sensor_type} = {sensor_value} para device_id {device_id}")
        except mysql.connector.Error as e:
            print(f"Erro no MySQL: {e}")
            db_connection.rollback()
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

    # Inscreve-se no tópico measure/sensor/+ (escuta todos os sensores)
    client.subscribe("measure/sensor/+")

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
