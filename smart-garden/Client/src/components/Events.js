import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [predictedFertilizer, setPredictedFertilizer] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = async (id = null) => {
    setIsLoading(true);
    setError('');
    try {
      const url = id ? `http://localhost:3001/events/${id}` : 'http://localhost:3001/events';
      const response = await axios.get(url);
      setEvents(response.data.data);
      setFilteredEvents(response.data.data);
    } catch (error) {
      setError('Erro ao buscar eventos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/devices');
      if (response.data.success) {
        setDevices(response.data.data);
      } else {
        console.error('Erro ao carregar dispositivos');
      }
    } catch (error) {
      console.error('Erro ao se conectar com o servidor:', error);
    }
  };

  const fetchPrediction = async () => {
    try {
      const response = await axios.post('http://localhost:8000/predict?api_key=6d2a222c0a4cb9354b52687ceb0ddf1f');
      setPredictedFertilizer(response.data);
    } catch (error) {
      setError('Erro ao buscar predição. Tente novamente.');
    }
  };

  const handleDelete = async (alertMessage) => {
    const confirmDelete = window.confirm(`Você realmente deseja deletar o evento "${alertMessage}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/events/${alertMessage}`);
      setEvents(events.filter((event) => event.alertMessage !== alertMessage));
      setFilteredEvents(filteredEvents.filter((event) => event.alertMessage !== alertMessage));
    } catch (error) {
      setError('Erro ao deletar evento. Tente novamente.');
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedDevice(value);
    setFilteredEvents(events.filter((event) => String(event.device_id).includes(value)));
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrediction();
      fetchEvents();
      fetchDevices();
    };
    fetchData();
  }, []);

  return (
    <>
      <TopBar />
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <h1>Eventos</h1>
            <hr className="title-divider" />
            <div className="filter-container2">
              <label htmlFor="device-dropdown">Filtros:</label>
              <select id="device-dropdown" value={selectedDevice} onChange={handleFilterChange}>
                <option value="">Selecione um dispositivo</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.id} - {device.name}
                  </option>
                ))}
              </select>
            </div>
            <hr className="title-divider" />
            {isLoading && <p>Carregando...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="events-container">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`alert-card ${event.type === 'critical' ? 'critical' : 'warning'}`}
                >
                  <div className="alert-icon-container">
                    <i
                      className={`fa-solid fa-exclamation-triangle alert-icon ${event.type === 'critical' ? 'critical' : 'warning'}`}
                    ></i>
                  </div>
                  <div className="alert-text-container">
                    <span className="alert-message">{event.alertMessage}</span>
                    {event.gene_by_ia === 1 && <div className="generated-by-ai">Gerado por IA</div>}
                    <div className="event-details">
                      <p><strong>Device:</strong> {event.device_id}</p>
                      <p><strong>Data de Criação:</strong> {event.created_at ? new Date(event.created_at).toLocaleString() : 'Data indisponível'}</p>
                    </div>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event.alertMessage)}
                    aria-label="Deletar alerta"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            {predictedFertilizer && (
              <div className="prediction-container">
                <h3>Recomendação de Fertilizante:</h3>
                <p><strong>Fertilizante:</strong> {predictedFertilizer['Predicted Fertilizer']}</p>
                <p><strong>Mensagem:</strong> {predictedFertilizer['Message']}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Events;
