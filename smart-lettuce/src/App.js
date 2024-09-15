import React from 'react';
import SensorData from './SensorData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo ao Meu Projeto IoT!</h1>
        <SensorData type="Umidade" value="45%" />
        <SensorData type="Temperatura" value="22°C" />
        <SensorData type="pH" value="6.8" />
      </header>
    </div>
  );
}

export default App;