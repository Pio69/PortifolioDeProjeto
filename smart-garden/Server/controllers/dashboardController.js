const db = require('../models/db');

// Obter os valores mais recentes dos sensores
exports.getDashboardData = async (req, res) => {
  try {
    const query = `
      SELECT 
        MAX(CASE WHEN sensor_type = 'Temperature' THEN sensor_value END) AS Temperature,
        MAX(CASE WHEN sensor_type = 'Humidity' THEN sensor_value END) AS Humidity,
        MAX(CASE WHEN sensor_type = 'SoilMoisture' THEN sensor_value END) AS SoilMoisture,
        MAX(CASE WHEN sensor_type = 'pH' THEN sensor_value END) AS pH,
        MAX(CASE WHEN sensor_type = 'NPKNitrogen' THEN sensor_value END) AS NPKNitrogen,
        MAX(CASE WHEN sensor_type = 'NPKPhosphorus' THEN sensor_value END) AS NPKPhosphorus,
        MAX(CASE WHEN sensor_type = 'NPKPotassium' THEN sensor_value END) AS NPKPotassium
      FROM 
        tb_measures
      WHERE 
        data = (SELECT MAX(data) FROM tb_measures);
    `;

    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum dado encontrado para o dashboard' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter dados do dashboard' });
  }
};
