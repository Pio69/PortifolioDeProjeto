// routes/eventsRoutes.js
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Rota para listar eventos
router.get('/', eventsController.getEvents);

// Rota para deletar evento
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
