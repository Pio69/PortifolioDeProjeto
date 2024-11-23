const express = require('express');
const router = express.Router();
const devicesController = require('../controllers/devicesController');

// Rotas de dispositivos
router.get('/', devicesController.getDevices); // Listar dispositivos
router.post('/', devicesController.addDevice); // Adicionar dispositivo
router.put('/:id', devicesController.updateDevice); // Atualizar dispositivo
router.delete('/:id', devicesController.deleteDevice); // Deletar dispositivo

module.exports = router;
