import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "@antv/g2plot";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const [sensorsData, setSensorsData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const temperatureChartRef = useRef(null);
  const soilMoistureChartRef = useRef(null);
  const phChartRef = useRef(null); // Referência ao gráfico de pH
  const npkChartRef = useRef(null); // Referência ao gráfico de NPK
  const temperatureChartInstance = useRef(null);
  const soilMoistureChartInstance = useRef(null);
  const phChartInstance = useRef(null); // Instância do gráfico de pH
  const npkChartInstance = useRef(null); // Instância do gráfico de NPK

  const fetchData = async () => {
    try {
      const [dashboardResponse, historyResponse] = await Promise.all([
        axios.get("http://localhost:3001/dashboard"),
        axios.get("http://localhost:3001/measures/history"),
      ]);

      if (dashboardResponse.data.success && historyResponse.data.success) {
        setSensorsData(dashboardResponse.data.data);
        setHistoryData(historyResponse.data.data);
        setLastUpdated(new Date());
      } else {
        setError("Erro ao carregar dados.");
      }
    } catch (err) {
      setError("Erro ao se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const initializeCharts = () => {
    if (historyData.length > 0) {
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

      const temperatureHumidityData = historyData
        .filter(
          (item) =>
            item.sensor_type === "Temperature" || item.sensor_type === "Humidity"
        )
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

      const soilMoistureData = historyData
        .filter((item) => item.sensor_type === "SoilMoisture")
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

      const phData = historyData
        .filter((item) => item.sensor_type === "pH")
        .map((item) => ({
          date: item.data,
          value: item.sensor_value,
          type: item.sensor_type,
        }));

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

      // Gráfico de pH
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
                  .slice(-2)}`; // Fixed here
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

      // Gráfico de NPK
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

  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.round((now - lastUpdated) / 60000);
    if (diff < 1) return "agora mesmo";
    return `há ${diff} minuto${diff > 1 ? "s" : ""}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (historyData.length > 0) {
      initializeCharts();
    }

    return () => {
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
  }, [historyData]);

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
          <div className="stats-grid">
            {sensorsData && (
              <>
                <div className="stat-card">
                  <h3 className="stat-title">Temperature</h3>
                  <p className="stat-value">{sensorsData.Temperature}°C</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Humidity</h3>
                  <p className="stat-value">{sensorsData.Humidity}%</p>
                  <div className="last-updated">
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Soil Moisture</h3>
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
                    {sensorsData.NPKNitrogen}-{sensorsData.NPKPhosphorus}-
                    {sensorsData.NPKPotassium}
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
              <h3 className="chart-title">Air Temperature & Humidity</h3>
              <div ref={temperatureChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Soil Moisture</h3>
              <div ref={soilMoistureChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">pH Levels</h3>
              <div ref={phChartRef} className="chart"></div>
              <div className="last-updated">
                <span>{getTimeAgo()}</span>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">NPK Levels</h3>
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
