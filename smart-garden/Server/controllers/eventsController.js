// controllers/eventsController.js
const db = require('../models/db');

// Listar eventos
exports.getEvents = async (req, res) => {
  try {
    const [events] = await db.query(
      'SELECT id, `desc` AS alertMessage, `level` AS type, gene_by_ia FROM tb_events'
    );
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar eventos' });
  }
};


// Deletar evento
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM tb_events WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }

    res.status(200).json({ success: true, message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar evento' });
  }
};