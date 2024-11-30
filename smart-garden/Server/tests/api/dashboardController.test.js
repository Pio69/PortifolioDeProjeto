const request = require('supertest');
const app = require('../../index'); // Assumindo que o index.js exporta o app

jest.mock('../../models/db', () => ({
  query: jest.fn(),  // Mock para a função `query`
}));

describe('GET /dashboard', () => {
  
  it('deve retornar dados do dashboard com sucesso', async () => {
    // Mock de dados para o banco de dados
    const mockData = [{
      Nitrogen: 59.0399,
      Phosphorus: 10.8734,
      Potassium: 136.608,
      pH: 5.50961,
      Conductivity: 1.28367,
      Temperature: 18.4138,
      Humidity: 67.972,
      device_id: 2,
      created_at: '2024-12-07T17:23:00.000Z',
    }];

    // Mock do retorno do db.query
    const db = require('../../models/db');
    db.query.mockResolvedValue([mockData]);

    // Enviar a requisição
    const response = await request(app)
      .get('/dashboard')
      .query({ deviceId: '2' }); // Passando o deviceId na query

    // Verificar se a resposta foi bem-sucedida e os dados estão corretos
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockData[0]);
  });

  it('deve retornar erro quando o deviceId não for fornecido', async () => {
    const response = await request(app).get('/dashboard');

    // Verificar erro de "deviceId" não fornecido
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('deviceId é necessário');
  });

  it('deve retornar erro quando não houver dados no banco para o deviceId', async () => {
    const db = require('../../models/db');
    db.query.mockResolvedValue([[]]); // Simulando que o banco não retornou dados

    const response = await request(app)
      .get('/dashboard')
      .query({ deviceId: '2' });

    // Verificar o caso onde não há dados para o deviceId no banco
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Nenhum dado encontrado para o dashboard no intervalo especificado');
  });

  it('deve retornar erro 500 em caso de falha na consulta ao banco de dados', async () => {
    const db = require('../../models/db');
    db.query.mockRejectedValue(new Error('Database error')); // Simulando erro no banco de dados

    const response = await request(app)
      .get('/dashboard')
      .query({ deviceId: '2' });

    // Verificar o tratamento de erro interno
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Erro ao obter dados do dashboard');
  });
  
});
