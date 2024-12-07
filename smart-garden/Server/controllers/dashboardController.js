// Ajuste do Dashboard Controller

const db = require('../models/db');

// Obter o último registro de dados do sensor com base em um intervalo de datas
exports.getDashboardData = async (req, res) => {
  try {
    // Inicialização da query base
    let query = `
      SELECT 
        Nitrogen,
        Phosphorus,
        Potassium,
        pH,
        Conductivity,
        Temperature,
        Humidity,
        Salinity,
        TDS,
        device_id,
        created_at_mili
      FROM 
        tb_measures
      WHERE 1=1
    `;

    const { deviceId, startDate, endDate } = req.query;
    const queryParams = [];

    // Verificar se deviceId foi passado
    if (deviceId) {
      if (isNaN(Number(deviceId))) {
        return res.status(400).json({ success: false, message: 'deviceId inválido' });
      }
      query += ' AND device_id = ?';
      queryParams.push(deviceId);
    }

    // Adicionar filtro de intervalo de datas se startDate e endDate forem passados
    if (startDate && endDate) {
      query += ' AND created_at_mili BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    // Garantir que o created_at_mili não seja nulo e ordenar por data de criação em ordem decrescente e limitar a 1 registro
    query += ' AND created_at_mili IS NOT NULL ORDER BY created_at_mili DESC LIMIT 1';

    // Executar a consulta
    const [rows] = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum dado encontrado para o dashboard no intervalo especificado' });
    }

    // Retorna apenas o último registro encontrado
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter dados do dashboard' });
  }
};
