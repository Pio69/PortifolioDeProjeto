import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './styles.css';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [predictedFertilizer, setPredictedFertilizer] = useState(null);

  // Função para buscar eventos do backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // Função para chamar a API de predição e buscar o fertilizante recomendado
  const fetchPrediction = async () => {
    try {
      // Chama a API de predição sem dados do sensor
      const response = await axios.post('http://localhost:8000/predict');
      setPredictedFertilizer(response.data);
      console.log('Predição de fertilizante:', response.data);
    } catch (error) {
      console.error('Erro ao buscar predição:', error);
    }
  };

  // Função para deletar evento no backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
    }
  };

  // Chama as funções quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      await fetchPrediction(); // Chamar a API de predição
      fetchEvents(); // Carregar eventos
    };

    fetchData(); // Executa a função assíncrona
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
            <div className="events-container">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`alert-card ${event.type === 'critical' ? 'critical' : 'warning'}`}
                >
                  {/* Ícone em uma div separada */}
                  <div className="alert-icon-container">
                    <i
                      className={`fa-solid fa-exclamation-triangle alert-icon ${event.type === 'critical' ? 'critical' : 'warning'}`}
                    ></i>
                  </div>

                  {/* Texto em uma div separada */}
                  <div className="alert-text-container">
                    <span className="alert-message">{event.alertMessage}</span>
                    {event.gene_by_ia === 1 && (
                      <div className="generated-by-ai">Gerado por IA</div>
                    )}
                  </div>

                  {/* Botão de deletar */}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event.id)}
                    aria-label="Deletar alerta"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Exibindo a predição do fertilizante */}
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
