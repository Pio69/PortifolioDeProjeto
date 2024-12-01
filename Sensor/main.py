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
        # Conecta ao cliente Modbus
        if not modbus_client.connect():
            print("Não foi possível conectar ao cliente Modbus.")
            return None

        # Lê registros a partir do endereço 0 até 9
        result = modbus_client.read_holding_registers(0, 9)

        if hasattr(result, 'isError') and result.isError():
            print("Erro ao ler registros:", result)
            return None

        # Extrai dados dos registros lidos
        data = {
            "Humidity": result.registers[0] * 0.1,  # Umidade (%RH)
            "Temperature": result.registers[1] * 0.1,  # Temperatura (°C)
            "Conductivity": result.registers[2],  # Condutividade (us/cm)
            "pH": result.registers[3] * 0.1,  # pH
            "Nitrogen": result.registers[4],  # Nitrogênio (mg/kg)
            "Phosphorus": result.registers[5],  # Fósforo (mg/kg)
            "Potassium": result.registers[6],  # Potássio (mg/kg)
            "Salinity": result.registers[7],  # Salinidade (mg/L)
            "TDS": result.registers[8]  # TDS (mg/L)
        }

        return data

    except Exception as e:
        print(f"Erro: {e}")
        return None
    finally:
        # Desconecta do cliente Modbus
        modbus_client.close()

# Função para publicar dados no tópico MQTT
def publish_data(topic, data):
    try:
        # Converte os dados para JSON
        message = json.dumps(data)
        mqtt_client.publish(topic, message)
        print(f"Mensagem publicada no tópico '{topic}': {message}")
    except Exception as e:
        print(f"Erro ao publicar mensagem MQTT: {e}")

# Loop principal: leitura e publicação
def main():
    try:
        while True:
            # Lê os dados do sensor
            sensor_data = read_sensor_data()
            if sensor_data:
                # Publica os dados no tópico MQTT
                publish_data("measure/sensor/7", sensor_data)
            
            print("Aguardando 30 segundos para a próxima leitura...\n")
            time.sleep(600)
    except KeyboardInterrupt:
        print("Execução interrompida pelo usuário.")
    finally:
        # Fecha o cliente MQTT
        mqtt_client.disconnect()

if __name__ == "__main__":
    main()
