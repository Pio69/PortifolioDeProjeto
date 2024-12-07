// controllers/devicesController.js

const db = require("../models/db");

// Listar dispositivos
exports.getDevices = async (req, res) => {
  try {
    const [devices] = await db.query("SELECT * FROM tb_devices");
    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    console.error("Erro ao listar dispositivos:", error);
    res.status(500).json({ success: false, message: "Erro ao listar dispositivos" });
  }
};

// Adicionar novo dispositivo
exports.addDevice = async (req, res) => {
  const { name, lat, lon, user_id } = req.body;

  try {
    if (!name || !lat || !lon || !user_id) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    await db.query(
      "INSERT INTO tb_devices (name, lat, lon, user_id) VALUES (?, ?, ?, ?)",
      [name, lat, lon, user_id]
    );

    res.status(201).json({ success: true, message: "Dispositivo adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar dispositivo:", error);
    res.status(500).json({ success: false, message: "Erro ao adicionar dispositivo" });
  }
};


// Atualizar dispositivo
exports.updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, lat, lon } = req.body;

  try {
    const [result] = await db.query("UPDATE tb_devices SET name = ?, lat = ?, lon = ? WHERE id = ?", [
      name,
      lat,
      lon,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    res.status(200).json({ success: true, message: "Dispositivo atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar dispositivo:", error);
    res.status(500).json({ success: false, message: "Erro ao atualizar dispositivo" });
  }
};

// Excluir dispositivo
exports.deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tb_devices WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    res.status(200).json({ success: true, message: "Dispositivo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir dispositivo:", error);
    res.status(500).json({ success: false, message: "Erro ao excluir dispositivo" });
  }
};
