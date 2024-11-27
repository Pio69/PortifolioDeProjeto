import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "@antv/g2plot";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const [sensorsData, setSensorsData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [climateData, setClimateData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const temperatureChartRef = useRef(null);
  const soilMoistureChartRef = useRef(null);
  const phChartRef = useRef(null);
  const npkChartRef = useRef(null);
  const temperatureChartInstance = useRef(null);
  const soilMoistureChartInstance = useRef(null);
  const phChartInstance = useRef(null);
  const npkChartInstance = useRef(null);

  // Função para calcular o tempo desde a última atualização
  const getTimeAgo = () => {
    const now = new Date();
    const diff = now - lastUpdated;
    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Atualizado há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `Atualizado há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    } else if (diffMinutes > 0) {
      return `Atualizado há ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    } else {
      return "Atualizado agora mesmo";
    }
  };

  const fetchData = async (deviceId) => {
    try {
      setLoading(true);
      setError(null);

      // Construir parâmetros de data para a requisição
      const params = {
        deviceId: deviceId,
        startDate: startDate ? `${startDate} 00:00:00` : undefined,
        endDate: endDate ? `${endDate} 23:59:59` : undefined,
      };

      const [dashboardResponse, historyResponse, climateResponse] = await Promise.all([
        axios.get("http://localhost:3001/dashboard", { params }),
        axios.get("http://localhost:3001/measures/history", { params }),
        axios.get("http://localhost:3001/climate", { params }),
      ]);

      if (dashboardResponse.data.success && historyResponse.data.success && climateResponse.data.success) {
        console.log(JSON.stringify(dashboardResponse.data.data))
        setSensorsData(dashboardResponse.data.data);
        setHistoryData(historyResponse.data.data);
        setClimateData(climateResponse.data.data);
        setLastUpdated(new Date());
      } else {
        setError("Erro ao carregar dados.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = () => {
    // Destruir instâncias anteriores dos gráficos, se existirem
    if (temperatureChartInstance.current) {
      temperatureChartInstance.current.destroy();
    }
    if (soilMoistureChartInstance.current) {
      soilMoistureChartInstance.current.destroy();
    }
    if (phChartInstance.current) {
      phChartInstance.current.destroy();
    }
    if (npkChartInstance.current) {
      npkChartInstance.current.destroy();
    }
  
    if (historyData.length > 0 || climateData.length > 0) {
      // Preparar dados para o gráfico de Temperatura e Umidade
      const temperatureHumidityData = [
        ...historyData.map((item) => ({
          date: item.created_at,
          value: item.temperature,
          type: "Temperature",
        })),
        ...historyData.map((item) => ({
          date: item.created_at,
          value: item.humidity,
          type: "Humidity",
        })),
        ...climateData.map((item) => ({
          date: item.recorded_at,
          value: item.value,
          type: item.sensor_type,
        })),
      ];
  
      // Preparar dados para o gráfico de pH
      const phData = historyData.map((item) => ({
        date: item.created_at,
        value: item.ph,
        type: "pH",
      }));
  
      // Preparar dados para o gráfico de NPK
      const npkData = historyData.flatMap((item) => [
        { date: item.created_at, value: item.nitrogen, type: "Nitrogen" },
        { date: item.created_at, value: item.phosphorus, type: "Phosphorus" },
        { date: item.created_at, value: item.potassium, type: "Potassium" },
      ]);
  
      // Preparar dados para o gráfico de Umidade do Solo
      const soilMoistureData = historyData.map((item) => ({
        date: item.created_at,
        value: item.humidity,
        type: "Humidity",
      }));
  
      // Inicializar o gráfico de Temperatura e Umidade
      if (temperatureChartRef.current) {
        temperatureChartInstance.current = new Line(temperatureChartRef.current, {
          data: temperatureHumidityData,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ["#3498db", "#2ecc71"],
          smooth: true, // Faz a linha ficar suavizada para melhorar a visualização
          xAxis: {
            type: "time",
            label: {
              formatter: (text) => {
                const date = new Date(text);
                return `${date.getDate()}/${date.getMonth() + 1}/${date
                  .getFullYear()
                  .toString()
                  .slice(-2)}`;
              },
            },
          },
          yAxis: {
            tickInterval: 5,
            label: {
              formatter: (text) => `${Math.round(text)}`,
            },
          },
          tooltip: {
            shared: true,
          },
          animation: true,
        });
        temperatureChartInstance.current.render();
      }

  
      // Inicializar o gráfico de pH
      if (phChartRef.current) {
        phChartInstance.current = new Line(phChartRef.current, {
          data: phData,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ["#8e44ad"],
          point: {
            size: 5,
            shape: "circle",
          },
          xAxis: {
            type: "time",
            label: {
              formatter: (text) => {
                const date = new Date(text);
                return `${date.getDate()}/${date.getMonth() + 1}/${date
                  .getFullYear()
                  .toString()
                  .slice(-2)}`;
              },
            },
          },
          tooltip: {
            shared: true,
          },
          animation: true,
        });
        phChartInstance.current.render();
      }
  
      // Inicializar o gráfico de NPK
      if (npkChartRef.current) {
        npkChartInstance.current = new Line(npkChartRef.current, {
          data: npkData,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ["#e74c3c", "#2980b9", "#27ae60"],
          point: {
            size: 5,
            shape: "circle",
          },
          xAxis: {
            type: "time",
            label: {
              formatter: (text) => {
                const date = new Date(text);
                return `${date.getDate()}/${date.getMonth() + 1}/${date
                  .getFullYear()
                  .toString()
                  .slice(-2)}`;
              },
            },
          },
          tooltip: {
            shared: true,
          },
          animation: true,
        });
        npkChartInstance.current.render();
      }
  
      // Inicializar o gráfico de Umidade do Solo
      if (soilMoistureChartRef.current) {
        soilMoistureChartInstance.current = new Line(soilMoistureChartRef.current, {
          data: soilMoistureData,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ["#f39c12"],
          point: {
            size: 5,
            shape: "circle",
          },
          xAxis: {
            type: "time",
            label: {
              formatter: (text) => {
                const date = new Date(text);
                return `${date.getDate()}/${date.getMonth() + 1}/${date
                  .getFullYear()
                  .toString()
                  .slice(-2)}`;
              },
            },
          },
          tooltip: {
            shared: true,
          },
          animation: true,
        });
        soilMoistureChartInstance.current.render();
      }
    }
  };
  

  // Fetch devices ao montar o componente
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesResponse = await axios.get("http://localhost:3001/devices");
        if (devicesResponse.data.success) {
          setDevices(devicesResponse.data.data);
        } else {
          setError("Erro ao carregar dispositivos.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao se conectar com o servidor.");
      }
    };

    fetchDevices();
  }, []);

  // Inicializar gráficos quando historyData ou climateData mudarem
  useEffect(() => {
    if (historyData.length > 0 || climateData.length > 0) {
      initializeCharts();
    }

    return () => {
      // Limpar instâncias dos gráficos ao desmontar ou atualizar
      if (temperatureChartInstance.current) {
        temperatureChartInstance.current.destroy();
        temperatureChartInstance.current = null;
      }
      if (soilMoistureChartInstance.current) {
        soilMoistureChartInstance.current.destroy();
        soilMoistureChartInstance.current = null;
      }
      if (phChartInstance.current) {
        phChartInstance.current.destroy();
        phChartInstance.current = null;
      }
      if (npkChartInstance.current) {
        npkChartInstance.current.destroy();
        npkChartInstance.current = null;
      }
    };
  }, [historyData, climateData]);

  // Renderização condicional para loading e error
  if (loading) {
    return (
      <div className="loading">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <div className="device-selector">
            <label htmlFor="device-dropdown" className="device-label">Dispositivo</label>
            <select
              id="device-dropdown"
              value={selectedDevice}
              onChange={(e) => {
                const selectedDeviceId = e.target.value;
                setSelectedDevice(selectedDeviceId);
                if (selectedDeviceId) {
                  fetchData(selectedDeviceId);
                }
              }}
              className="device-dropdown"
            >
              <option value="">Selecione um dispositivo</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.id} - {device.name}
                </option>
              ))}
            </select>
          </div>
          <div className="date-filter">
            <label htmlFor="start-date" className="date-label">Data de Início:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />

            <label htmlFor="end-date" className="date-label">Data de Fim:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />

            <button
              onClick={() => {
                if (selectedDevice) {
                  fetchData(selectedDevice);
                }
              }}
              className="filter-button"
            >
              Filtrar
            </button>
          </div>

          <hr className="title-divisor" />
          <div className="stats-grid">
            {sensorsData && (
              <>
                <div className="stat-card">
                  <h3 className="stat-title">Temperatura</h3>
                  <p className="stat-value">
                    {sensorsData.Temperature !== undefined ? `${sensorsData.Temperature}°C` : "--"}
                  </p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Umidade</h3>
                  <p className="stat-value">
                    {sensorsData.Humidity !== undefined ? `${sensorsData.Humidity}%` : "--"}
                  </p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">pH</h3>
                  <p className="stat-value">
                    {sensorsData.pH !== undefined ? sensorsData.pH : "--"}
                  </p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">NPK</h3>
                  <p className="stat-value">
                    {sensorsData.Nitrogen !== undefined &&
                    sensorsData.Phosphorus !== undefined &&
                    sensorsData.Potassium !== undefined
                      ? `${sensorsData.Nitrogen}-${sensorsData.Phosphorus}-${sensorsData.Potassium}`
                      : "--"}
                  </p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
              </>
            )}
          </div>



          <div className="charts-grid">
            <div className="chart-container">
              <h3 className="chart-title">Temperatura e Umidade do Ar</h3>
              <div ref={temperatureChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Umidade do Solo</h3>
              <div ref={soilMoistureChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Níveis de pH</h3>
              <div ref={phChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Níveis de NPK</h3>
              <div ref={npkChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
