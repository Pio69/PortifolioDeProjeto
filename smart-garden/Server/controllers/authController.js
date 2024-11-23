// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { SECRET_KEY, saltRounds } = require('../config');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const [result] = await db.query('SELECT * FROM tb_users WHERE email = ?', [email]);

    if (result.length === 0) {
      // Hash da senha
      const hash = await bcrypt.hash(password, saltRounds);

      // Insere o novo usuário no banco de dados
      await db.query('INSERT INTO tb_users (email, password) VALUES (?, ?)', [email, hash]);

      console.log('Usuário cadastrado com sucesso.');
      return res.status(201).json({ success: true, msg: 'Usuário cadastrado com sucesso' });
    } else {
      console.log('Email já cadastrado.');
      return res.status(400).json({ success: false, msg: 'Email já cadastrado' });
    }
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return res.status(500).json({ success: false, msg: 'Erro no servidor ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo email
    const [result] = await db.query('SELECT * FROM tb_users WHERE email = ?', [email]);

    if (result.length > 0) {
      // Compara a senha fornecida com o hash armazenado
      const match = await bcrypt.compare(password, result[0].password);

      if (match) {
        // Gera um token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Token válido por 1 hora
        console.log('Login bem-sucedido.');
        return res.status(200).json({ success: true, msg: 'Login bem-sucedido', token });
      } else {
        console.log('Email ou senha incorretos.');
        return res.status(200).json({ success: false, msg: 'Email ou senha incorretos' });
      }
    } else {
      console.log('Usuário não registrado.');
      return res.status(200).json({ success: false, msg: 'Usuário não registrado!' });
    }
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ success: false, msg: 'Erro no servidor ao fazer login' });
  }
};

