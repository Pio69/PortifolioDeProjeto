const express = require("express");
const router = express.Router();
const climateController = require("../controllers/climateController");

// Rota para obter todos os dados climáticos
router.get("/", climateController.getAllClimateData);

// Rota para buscar dados climáticos por intervalo de data
router.get("/by-date", climateController.getClimateDataByDate);

// Export the router directly
module.exports = router;
