const db = require("../models/db");

// Função para obter todos os registros de climate_data
const getAllClimateData = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM climate_data ORDER BY recorded_at DESC");
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar os dados climáticos.",
    });
  }
};

// Função para buscar registros por intervalo de data
const getClimateDataByDate = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Por favor, forneça 'startDate' e 'endDate' nos parâmetros da consulta.",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM climate_data WHERE recorded_at BETWEEN ? AND ? ORDER BY recorded_at DESC",
      [startDate, endDate]
    );
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar os dados climáticos por data.",
    });
  }
};

module.exports = {
  getAllClimateData,
  getClimateDataByDate,
};
