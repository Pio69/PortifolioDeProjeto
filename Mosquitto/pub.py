import paho.mqtt.client as mqtt
import time

# Função para publicar uma mensagem no tópico measure/sensor/1
def publish_message():
    # Cria um cliente MQTT
    client = mqtt.Client()

    # Conecta ao servidor Mosquitto (localhost no caso)
    client.connect("localhost", 1883, 60)

    # Publica a mensagem em loop a cada 1 minuto
    while True:
        message = "{Temperature:22.5,Humidity:60,SoilMoisture:40,pH:6.8,NPKNitrogen:20,NPKPhosphorus:15,NPKPotassium:25}"
        
        
        client.publish("measure/sensor/1", message)
        print(f"Mensagem publicada: {message}")
        
        # Espera 60 segundos (1 minuto)
        time.sleep(60)

if __name__ == "__main__":
    publish_message()
