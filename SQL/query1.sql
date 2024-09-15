CREATE TABLE tb_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE tb_measures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_value DECIMAL(10, 2) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id INT,  -- Adicionado para referenciar tb_devices
    FOREIGN KEY (device_id) REFERENCES tb_devices(id)
);

CREATE TABLE tb_anomaly_detection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anomaly_type VARCHAR(50) NOT NULL,
    sensor_data_id INT,
    data TEXT,
    action_taken TEXT,
    FOREIGN KEY (sensor_data_id) REFERENCES tb_measures(id)
);

CREATE TABLE tb_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

ALTER TABLE tb_measures
ADD CONSTRAINT fk_measures_devices
FOREIGN KEY (device_id) REFERENCES tb_devices(id);

ALTER TABLE tb_anomaly_detection
ADD CONSTRAINT fk_anomaly_measures
FOREIGN KEY (sensor_data_id) REFERENCES tb_measures(id);


ALTER TABLE tb_devices
ADD COLUMN name VARCHAR(255) NOT NULL;


INSERT INTO tb_devices (location, name) VALUES ('Laboratório de Pesquisa', 'SensorLab1');
INSERT INTO tb_devices (location, name) VALUES ('Campo de Testes', 'SensorField2');

-- Medições para o dispositivo 1 (SensorLab1)
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (23.5, 'Temperatura', 1);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (50.0, 'Umidade', 1);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (6.8, 'pH', 1);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (24.0, 'Temperatura', 1);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (48.5, 'Umidade', 1);

-- Medições para o dispositivo 2 (SensorField2)
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (22.0, 'Temperatura', 2);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (55.0, 'Umidade', 2);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (7.2, 'pH', 2);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (21.5, 'Temperatura', 2);
INSERT INTO tb_measures (sensor_value, sensor_type, device_id) VALUES (53.0, 'Umidade', 2);