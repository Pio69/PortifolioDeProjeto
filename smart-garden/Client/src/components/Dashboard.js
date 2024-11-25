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
      const [dashboardResponse, historyResponse, climateResponse] = await Promise.all([
        axios.get(`http://localhost:3001/dashboard?deviceId=${deviceId}`),
        axios.get(`http://localhost:3001/measures/history?deviceId=${deviceId}`),
        axios.get(`http://localhost:3001/climate?deviceId=${deviceId}`)
      ]);

      if (dashboardResponse.data.success && historyResponse.data.success && climateResponse.data.success) {
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
      // Preparar dados para os gráficos de Temperatura e Umidade
      const temperatureHumidityData = [
        ...historyData
          .filter(
            (item) =>
              item.sensor_type === "Temperature" || item.sensor_type === "Humidity"
          )
          .map((item) => ({
            date: item.data,
            value: item.sensor_value,
            type: item.sensor_type,
          })),
        ...climateData
          .filter(
            (item) =>
              item.sensor_type === "Temperature" || item.sensor_type === "Humidity"
          )
          .map((item) => ({
            date: item.recorded_at,
            value: item.value,
            type: item.sensor_type,
          })),
      ];

      // Preparar dados para o gráfico de Umidade do Solo
      const soilMoistureData = historyData
        .filter((item) => item.sensor_type === "SoilMoisture")
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

      // Preparar dados para o gráfico de pH
      const phData = historyData
        .filter((item) => item.sensor_type === "pH")
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

      // Preparar dados para o gráfico de NPK
      const npkData = historyData
        .filter(
          (item) =>
            item.sensor_type === "NPKNitrogen" ||
            item.sensor_type === "NPKPhosphorus" ||
            item.sensor_type === "NPKPotassium"
        )
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

      // Inicializar o gráfico de Temperatura e Umidade
      if (temperatureChartRef.current) {
        temperatureChartInstance.current = new Line(temperatureChartRef.current, {
          data: temperatureHumidityData,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ["#3498db", "#2ecc71"],
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
          <hr className="title-divisor" />
          <div className="stats-grid">
            {sensorsData && (
              <>
                <div className="stat-card">
                  <h3 className="stat-title">Temperatura</h3>
                  <p className="stat-value">{sensorsData.Temperature}°C</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Umidade</h3>
                  <p className="stat-value">{sensorsData.Humidity}%</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Umidade do Solo</h3>
                  <p className="stat-value">{sensorsData.SoilMoisture}%</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">pH</h3>
                  <p className="stat-value">{sensorsData.pH}</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">NPK</h3>
                  <p className="stat-value">
                    {sensorsData.NPKNitrogen}-{sensorsData.NPKPhosphorus}-{sensorsData.NPKPotassium}
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
