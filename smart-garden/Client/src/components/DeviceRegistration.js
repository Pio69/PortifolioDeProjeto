import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles.css';
import './DeviceRegistration.css';

function DeviceRegistration() {
  const [devices, setDevices] = useState([]);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [newDevice, setNewDevice] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLon, setNewLon] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmação

  // Buscar dispositivos do backend
  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/devices');
      setDevices(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    }
  };

  // Adicionar ou atualizar dispositivo
  const handleAddDevice = async () => {
    try {
      if (newDevice.trim() && newLat.trim() && newLon.trim()) {
        if (currentDevice) {
          // Atualizar dispositivo existente
          await axios.put(`http://localhost:3001/devices/${currentDevice.id}`, {
            name: newDevice,
            lat: newLat,
            lon: newLon,
          });
        } else {
          // Adicionar novo dispositivo
          await axios.post('http://localhost:3001/devices', {
            name: newDevice,
            lat: newLat,
            lon: newLon,
          });
        }
        setShowModal(false);
        fetchDevices(); // Atualizar a lista de dispositivos
      }
    } catch (error) {
      console.error('Erro ao adicionar ou atualizar dispositivo:', error);
    }
  };

  // Confirmar exclusão de dispositivo
  const confirmDeleteDevice = (device) => {
    setCurrentDevice(device);
    setShowConfirmModal(true); // Abre o modal de confirmação
  };

  // Excluir dispositivo
  const handleDeleteDevice = async () => {
    try {
      if (currentDevice) {
        await axios.delete(`http://localhost:3001/devices/${currentDevice.id}`);
        fetchDevices(); // Atualizar a lista de dispositivos
        setShowConfirmModal(false); // Fecha o modal de confirmação
        setCurrentDevice(null); // Limpa o dispositivo atual
      }
    } catch (error) {
      console.error('Erro ao excluir dispositivo:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <>
      <TopBar />
      <div className="dashboard">
        <Sidebar />
        <div className="main-content p-4">
          <div className="container">
            <h1 className="mb-4">Cadastro de Dispositivos</h1>
            <hr className="title-divider" />
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">Lista de Dispositivos</h4>
                <table className="table table-bordered custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Localização (Lat, Lon)</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{device.name}</td>
                        <td>
                          Lat: {device.lat}, Lon: {device.lon}
                        </td>
                        <td>
                          <Button
                            className="custom-btn-primary me-2"
                            size="sm"
                            onClick={() => {
                              setCurrentDevice(device);
                              setNewDevice(device.name);
                              setNewLat(device.lat);
                              setNewLon(device.lon);
                              setShowModal(true);
                            }}
                          >
                            <i className="fa fa-pencil-alt"></i>
                          </Button>
                          <Button
                            className="custom-btn-secondary"
                            size="sm"
                            onClick={() => confirmDeleteDevice(device)}
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  className="custom-btn-primary"
                  onClick={() => {
                    setCurrentDevice(null);
                    setNewDevice('');
                    setNewLat('');
                    setNewLon('');
                    setShowModal(true);
                  }}
                >
                  Adicionar Novo Dispositivo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar ou editar dispositivo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentDevice ? 'Editar Dispositivo' : 'Adicionar Novo Dispositivo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nome do dispositivo"
              value={newDevice}
              onChange={(e) => setNewDevice(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Latitude"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Longitude"
              value={newLon}
              onChange={(e) => setNewLon(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button className="custom-btn-primary" onClick={handleAddDevice}>
            {currentDevice ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmação para exclusão */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja excluir o dispositivo <strong>{currentDevice?.name}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-btn-secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button className="custom-btn-danger" onClick={handleDeleteDevice}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeviceRegistration;
