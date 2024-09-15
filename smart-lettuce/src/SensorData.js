import React from 'react';

function SensorData({ type, value }) {
  return (
    <div>
      <h2>Dados do Sensor: {type}</h2>
      <p>Valor: {value}</p>
    </div>
  );
}

export default SensorData;