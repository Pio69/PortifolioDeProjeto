// controllers/measuresController.js
const db = require("../models/db");

exports.getMeasures = async (req, res) => {
  const { deviceId, startDate, endDate } = req.query; // Filtro por dispositivo e intervalo de datas (opcional)
  try {
    let query = deviceId
      ? "SELECT * FROM tb_measures WHERE device_id = ?"
      : "SELECT * FROM tb_measures";

    const queryParams = deviceId ? [deviceId] : [];

    // Adicionar filtro de intervalo de datas se startDate e endDate forem passados
    if (startDate && endDate) {
      query += deviceId ? " AND" : " WHERE";
      query += " created_at BETWEEN ? AND ?";
      queryParams.push(startDate, endDate);
    }

    const [rows] = await db.query(query, queryParams);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Erro ao buscar os dados de tb_measures:", err);
    res.status(500).json({ success: false, msg: "Erro ao buscar dados" });
  }
};

exports.getHistory = async (req, res) => {
  const { deviceId, startDate, endDate } = req.query;

  try {
    if (deviceId && isNaN(Number(deviceId))) {
      return res.status(400).json({ success: false, msg: "deviceId inválido" });
    }

    let query = `
      SELECT 
        Nitrogen AS nitrogen,
        Phosphorus AS phosphorus,
        Potassium AS potassium,
        pH AS ph,
        Conductivity AS conductivity,
        Temperature AS temperature,
        Humidity AS humidity,
        created_at,
        device_id
      FROM 
        tb_measures
      ${deviceId ? "WHERE device_id = ?" : ""}
    `;

    const queryParams = deviceId ? [deviceId] : [];

    // Adicionar filtro de intervalo de datas se startDate e endDate forem passados

    console.log("Query executada:" + startDate + " " +  endDate);
    if (startDate && endDate) {
      query += deviceId ? " AND" : "WHERE";
      query += " created_at BETWEEN ? AND ?";
      queryParams.push(startDate, endDate);
    }

    query += " AND created_at IS NOT NULL ORDER BY created_at ASC";

    console.log("Query executada:", query);
    const [rows] = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Nenhum dado encontrado" });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Erro ao obter histórico de medições:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter histórico de medições",
      error: error.message,
    });
  }
};
