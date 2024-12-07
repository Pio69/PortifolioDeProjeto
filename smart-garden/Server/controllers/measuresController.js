// controllers/measuresController.js
const db = require("../models/db");

exports.getMeasures = async (req, res) => {
  const { deviceId, startDate, endDate } = req.query;

  try {
    // Inicialização da query base
    let query = "SELECT * FROM tb_measures";
    const queryParams = [];

    // Adicionar filtro por `deviceId`, se presente
    if (deviceId) {
      if (isNaN(Number(deviceId))) {
        return res.status(400).json({ success: false, msg: "deviceId inválido" });
      }
      query += " WHERE device_id = ?";
      queryParams.push(deviceId);
    }

    // Adicionar filtro por intervalo de datas, se ambos presentes
    if (startDate && endDate) {
      const condition = deviceId ? " AND" : " WHERE";
      query += `${condition} created_at_mili BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    // Ordenar resultados por data de criação
    query += " ORDER BY created_at_mili ASC";

    // Executar a consulta
    const [rows] = await db.query(query, queryParams);

    // Retornar 404 se nenhum dado for encontrado
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Nenhum dado encontrado" });
    }

    // Retornar os dados encontrados
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
        Nitrogen,
        Phosphorus,
        Potassium,
        pH,
        Conductivity,
        Temperature,
        Humidity,
        Salinity,
        TDS,
        created_at_mili,
        device_id
      FROM 
        tb_measures
      WHERE 1=1
    `;

    const queryParams = [];

    if (deviceId) {
      query += " AND device_id = ?";
      queryParams.push(deviceId);
    }

    if (startDate && endDate) {
      query += " AND created_at_mili BETWEEN ? AND ?";
      queryParams.push(startDate, endDate);
    }

    // Garantir que o created_at_mili não seja nulo e ordenar por data
    query += " AND created_at_mili IS NOT NULL ORDER BY created_at_mili ASC";

    console.log("Query executada:", query, "Params:", queryParams);

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
