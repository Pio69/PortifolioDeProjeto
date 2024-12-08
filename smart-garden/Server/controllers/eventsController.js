// controllers/eventsController.js
const db = require('../models/db');

// Listar eventos
exports.getEvents = async (req, res) => {
  const { id } = req.params;

  try {
    let query = 'SELECT `desc` AS alertMessage, `level` AS type, gene_by_ia, created_at, device_id, measure FROM tb_events';
    let params = [];

    if (id) {
      query += ' WHERE id = ?';
      params.push(id);
    }

    const [events] = await db.query(query, params);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar eventos' });
  }
};

// Deletar evento
exports.deleteEvent = async (req, res) => {
  const { desc: description } = req.params; // Renomeando o parâmetro para evitar conflito

  try {
    const [result] = await db.query('DELETE FROM tb_events WHERE `desc` = ?', [description]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }

    res.status(200).json({ success: true, message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar evento' });
  }
};
