const request = require('supertest');
const app = require('../../index'); // Importa a instância do app do index.js
const db = require('../../models/db'); // Mock do banco de dados
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mocks para bcrypt e jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock do db.query
jest.mock('../../models/db');

describe('Auth Controller', () => {

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      db.query.mockResolvedValue([[]]); // Simula que o email não está cadastrado
      bcrypt.hash.mockResolvedValue('hashedpassword'); // Hash simulado
      const response = await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.msg).toBe('Usuário cadastrado com sucesso');
    });

    it('não deve registrar um usuário com email já cadastrado', async () => {
      db.query.mockResolvedValue([[{ email: 'test@example.com' }]]); // Simula que o email já existe
      const response = await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.msg).toBe('Email já cadastrado');
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com sucesso e retornar um token', async () => {
      db.query.mockResolvedValue([[{ email: 'test@example.com', password: 'hashedpassword' }]]);
      bcrypt.compare.mockResolvedValue(true); // Simula a senha correta
      jwt.sign.mockReturnValue('fake-jwt-token'); // Simula o JWT
      const response = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.msg).toBe('Login bem-sucedido');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('deve retornar erro quando a senha estiver incorreta', async () => {
      db.query.mockResolvedValue([[{ email: 'test@example.com', password: 'hashedpassword' }]]);
      bcrypt.compare.mockResolvedValue(false); // Simula senha incorreta
      const response = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.msg).toBe('Email ou senha incorretos');
    });

    it('deve retornar erro quando o usuário não estiver registrado', async () => {
      db.query.mockResolvedValue([[]]); // Simula que o usuário não existe
      const response = await request(app).post('/auth/login').send({ email: 'nonexistent@example.com', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.msg).toBe('Usuário não registrado!');
    });
  });
});
