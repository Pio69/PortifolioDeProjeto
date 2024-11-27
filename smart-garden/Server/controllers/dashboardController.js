const db = require('../models/db');

// Obter o último registro de dados do sensor com base em um intervalo de datas
exports.getDashboardData = async (req, res) => {
  try {
    let query = `
      SELECT 
        Nitrogen,
        Phosphorus,
        Potassium,
        pH,
        Conductivity,
        Temperature,
        Humidity,
        device_id,
        created_at
      FROM 
        tb_measures
      WHERE 
        device_id = ?
    `;

    const { deviceId, startDate, endDate } = req.query;

    // Verificar se deviceId foi passado
    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId é necessário' });
    }

    const queryParams = [deviceId];

    // Adicionar filtro de intervalo de datas se startDate e endDate forem passados
    if (startDate && endDate) {
      query += ' AND created_at BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    // Ordenar por data de criação em ordem decrescente e limitar a 1 registro
    query += ' ORDER BY created_at DESC LIMIT 1';

    const [rows] = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum dado encontrado para o dashboard no intervalo especificado' });
    }

    res.status(200).json({ success: true, data: rows[0] }); // Retorna apenas o último registro
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter dados do dashboard' });
  }
};
