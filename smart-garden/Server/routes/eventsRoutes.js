const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Rota para listar eventos (opcionalmente pode aceitar um parâmetro ID)
router.get('/', eventsController.getEvents);

// Rota para deletar um evento específico pelo campo `desc`
router.delete('/:desc', eventsController.deleteEvent);

module.exports = router;
