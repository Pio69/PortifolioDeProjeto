const request = require('supertest');
const app = require('../../index'); // Assumindo que o index.js exporta o app
const db = require('../../models/db');

// Mock para a função `query` do banco de dados
jest.mock('../../models/db', () => ({
  query: jest.fn(),
}));

describe('Testes para o controller de dispositivos', () => {
  // Teste para listar dispositivos
  describe('GET /devices', () => {
    it('deve retornar a lista de dispositivos com sucesso', async () => {
      const mockDevices = [
        { id: 1, name: 'Dispositivo 1', lat: 10.0, lon: 20.0 },
        { id: 2, name: 'Dispositivo 2', lat: 11.0, lon: 21.0 },
      ];
      
      // Simulando a resposta do banco de dados
      db.query.mockResolvedValue([mockDevices]);

      const response = await request(app).get('/devices');
      
      // Verificar se a resposta está correta
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDevices);
    });

    it('deve retornar erro 500 em caso de falha no banco de dados', async () => {
      db.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/devices');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao listar dispositivos');
    });
  });

  // Teste para adicionar um dispositivo
  describe('POST /devices', () => {
    it('deve adicionar um novo dispositivo com sucesso', async () => {
      const newDevice = { name: 'Dispositivo 3', lat: 12.0, lon: 22.0 };

      // Simulando a resposta de sucesso no banco de dados
      db.query.mockResolvedValue([{}]); 

      const response = await request(app)
        .post('/devices')
        .send(newDevice);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Dispositivo adicionado com sucesso');
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem ausentes', async () => {
      const response = await request(app)
        .post('/devices')
        .send({ name: 'Dispositivo 4' }); // lat e lon ausentes

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Todos os campos são obrigatórios');
    });

    it('deve retornar erro 500 em caso de falha no banco de dados', async () => {
      const newDevice = { name: 'Dispositivo 5', lat: 13.0, lon: 23.0 };
      db.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/devices')
        .send(newDevice);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao adicionar dispositivo');
    });
  });

  // Teste para atualizar um dispositivo
  describe('PUT /devices/:id', () => {
    it('deve atualizar um dispositivo com sucesso', async () => {
      const updatedDevice = { name: 'Dispositivo Atualizado', lat: 14.0, lon: 24.0 };
      
      db.query.mockResolvedValue([{ affectedRows: 1 }]); // Simula que 1 linha foi afetada

      const response = await request(app)
        .put('/devices/1')
        .send(updatedDevice);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Dispositivo atualizado com sucesso');
    });

    it('deve retornar erro 404 se o dispositivo não for encontrado', async () => {
      const updatedDevice = { name: 'Dispositivo Atualizado', lat: 14.0, lon: 24.0 };
      
      db.query.mockResolvedValue([{ affectedRows: 0 }]); // Simula que nenhum dispositivo foi atualizado

      const response = await request(app)
        .put('/devices/999') // ID inexistente
        .send(updatedDevice);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dispositivo não encontrado');
    });

    it('deve retornar erro 500 em caso de falha no banco de dados', async () => {
      const updatedDevice = { name: 'Dispositivo Atualizado', lat: 14.0, lon: 24.0 };
      
      db.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/devices/1')
        .send(updatedDevice);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao atualizar dispositivo');
    });
  });

  // Teste para excluir um dispositivo
  describe('DELETE /devices/:id', () => {
    it('deve excluir um dispositivo com sucesso', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]); // Simula que 1 linha foi excluída

      const response = await request(app).delete('/devices/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Dispositivo excluído com sucesso');
    });

    it('deve retornar erro 404 se o dispositivo não for encontrado', async () => {
      db.query.mockResolvedValue([{ affectedRows: 0 }]); // Simula que nenhum dispositivo foi excluído

      const response = await request(app).delete('/devices/999'); // ID inexistente

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dispositivo não encontrado');
    });

    it('deve retornar erro 500 em caso de falha no banco de dados', async () => {
      db.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/devices/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao excluir dispositivo');
    });
  });
});
