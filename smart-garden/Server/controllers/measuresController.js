// controllers/measuresController.js
const db = require("../models/db");

exports.getMeasures = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tb_measures");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar os dados de tb_measures:", err);
    res.status(500).json({ success: false, msg: "Erro ao buscar dados" });
  }
};

// Obter o histórico completo de medições
exports.getHistory = async (req, res) => {
  try {
    const query = `
      SELECT 
        sensor_type,
        sensor_value,
        data
      FROM 
        tb_measures
      ORDER BY 
        data ASC;
    `;

    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum dado encontrado' });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao obter histórico de medições:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter histórico de medições' });
  }
};
