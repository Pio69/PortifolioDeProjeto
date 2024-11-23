import mysql.connector
import pandas as pd
import matplotlib.pyplot as plt

# Establishing the MySQL connection
conn = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="admin",
        database="smartlettuce"
    )

# Query to get the data from the 'tb_measures' table
query = "SELECT sensor_value, sensor_type, data FROM tb_measures WHERE device_id = 2"

# Using pandas to read the query result
df = pd.read_sql(query, conn)

# Closing the connection
conn.close()

# Convert the 'data' column to datetime for better plotting
df['data'] = pd.to_datetime(df['data'])

# Plotting the data for each sensor type
plt.figure(figsize=(10, 6))

for sensor in df['sensor_type'].unique():
    sensor_data = df[df['sensor_type'] == sensor]
    plt.plot(sensor_data['data'], sensor_data['sensor_value'], label=sensor)

# Adding labels and title to the plot
plt.xlabel('Timestamp')
plt.ylabel('Sensor Value')
plt.title('Sensor Values Over Time')
plt.legend()

# Display the plot
plt.xticks(rotation=45)  # Rotate x-axis labels for better readability
plt.tight_layout()
plt.show()
