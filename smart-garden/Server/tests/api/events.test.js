// tests/api/events.test.js
const request = require('supertest');
const app = require('../../index'); // Assumindo que o index.js exporta o app

describe('Eventos Controller', () => {
  it('deve deletar o evento com sucesso', async () => {
    const desc = 'High-P Fertilizer';
    const device_id = 2;

    const response = await request(app).delete(`/events?desc=${desc}&device_id=${device_id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Evento deletado com sucesso');
  });

  it('deve retornar erro 404 se o evento não for encontrado', async () => {
    const desc = 'Nonexistent Event';
    const device_id = 9999; // Garantir que o evento não exista

    const response = await request(app).delete(`/events?desc=${desc}&device_id=${device_id}`);
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Evento não encontrado');
  });

  it('deve retornar erro 500 se falhar ao deletar evento', async () => {
    const desc = 'High-P Fertilizer';
    const device_id = 2;  // Aqui, simule um erro de banco de dados para testar o erro 500

    const response = await request(app).delete(`/events?desc=${desc}&device_id=${device_id}`);
    
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Erro ao deletar evento');
  });
});
