import paho.mqtt.client as mqtt
from pymodbus.client import ModbusSerialClient
import time
import json

# Configuração do cliente Modbus
modbus_client = ModbusSerialClient(
    port='COM3',
    baudrate=4800,
    timeout=1,
    parity='N',
    stopbits=1,
    bytesize=8
)

# Configuração do cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.connect("localhost", 1883, 60)

# Função para ler dados do sensor via Modbus
def read_sensor_data():
    try:
        if not modbus_client.connect():
            print("Não foi possível conectar ao cliente Modbus.")
            return None

        # Lê registros a partir do endereço 0 até 9
        result = modbus_client.read_holding_registers(0, 9)
        if hasattr(result, 'isError') and result.isError():
            print("Erro ao ler registros:", result)
            return None

        data = {
            "Humidity": result.registers[0] * 0.1,
            "Temperature": result.registers[1] * 0.1,
            "Conductivity": result.registers[2],
            "pH": result.registers[3] * 0.1,
            "Nitrogen": result.registers[4],
            "Phosphorus": result.registers[5],
            "Potassium": result.registers[6],
            "Salinity": result.registers[7],
            "TDS": result.registers[8]
        }
        return data

    except Exception as e:
        print(f"Erro: {e}")
        return None
    finally:
        modbus_client.close()

# Função para publicar dados no tópico MQTT
def publish_data(topic, data):
    try:
        message = json.dumps(data)
        mqtt_client.publish(topic, message)
        print(f"Mensagem publicada no tópico '{topic}': {message}")
    except Exception as e:
        print(f"Erro ao publicar mensagem MQTT: {e}")

# Função para publicar status do sensor
def publish_status():
    try:
        status_message = json.dumps({"status": "online"})
        mqtt_client.publish("measure/sensor/7/info", status_message)
        print(f"Status publicado no tópico 'measure/sensor/7/info': {status_message}")
    except Exception as e:
        print(f"Erro ao publicar status MQTT: {e}")

# Loop principal
def main():
    last_measures_time = time.time()
    try:
        while True:
            # Publicar status a cada 60 segundos
            publish_status()
            time.sleep(60)

            # Verifica se já passaram 10 minutos desde a última publicação de medidas
            if time.time() - last_measures_time >= 600:
                sensor_data = read_sensor_data()
                if sensor_data:
                    publish_data("measure/sensor/7/measures", sensor_data)
                last_measures_time = time.time()
    except KeyboardInterrupt:
        print("Execução interrompida pelo usuário.")
    finally:
        mqtt_client.disconnect()

if __name__ == "__main__":
    main()
