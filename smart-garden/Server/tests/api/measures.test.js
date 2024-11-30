const request = require("supertest");
const app = require("../../index"); // Certifique-se de exportar seu app no arquivo app.js ou index.js
const db = require("../../models/db");

jest.mock("../../models/db"); // Mock da conexão com o banco de dados

describe("Testes do Controller de Medições", () => {

  // Testando a rota /measures (GET)
  describe("GET /measures", () => {
    it("Deve retornar todas as medições sem filtros", async () => {
      // Mock da resposta do banco
      db.query.mockResolvedValue([[{ device_id: 1, value: 25, created_at: "2024-10-01" }]]);

      const response = await request(app).get("/measures");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it("Deve retornar medições filtradas por deviceId", async () => {
      const deviceId = 1;
      db.query.mockResolvedValue([[{ device_id: 1, value: 30, created_at: "2024-10-02" }]]);

      const response = await request(app).get(`/measures?deviceId=${deviceId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].device_id).toBe(deviceId);
    });

    it("Deve retornar medições filtradas por intervalo de datas", async () => {
      const startDate = "2024-10-01";
      const endDate = "2024-10-10";
      db.query.mockResolvedValue([[{ device_id: 1, value: 20, created_at: "2024-10-05" }]]);

      const response = await request(app).get(`/measures?startDate=${startDate}&endDate=${endDate}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].created_at).toBe("2024-10-05");
    });

    it("Deve retornar erro 500 se houver erro no banco", async () => {
      db.query.mockRejectedValue(new Error("Erro no banco"));

      const response = await request(app).get("/measures");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  // Testando a rota /history (GET)
  describe("GET /history", () => {
    it("Deve retornar o histórico de medições", async () => {
      const deviceId = 1;
      const startDate = "2024-10-01";
      const endDate = "2024-10-10";

      db.query.mockResolvedValue([[{ device_id: 1, nitrogen: 15, created_at: "2024-10-05" }]]);

      const response = await request(app).get(`/history?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].device_id).toBe(deviceId);
    });

    it("Deve retornar erro 400 se o deviceId for inválido", async () => {
      const deviceId = "invalid";  // Valor não numérico

      const response = await request(app).get(`/history?deviceId=${deviceId}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.msg).toBe("deviceId inválido");
    });

    it("Deve retornar erro 404 se nenhum dado for encontrado", async () => {
      const deviceId = 1;
      const startDate = "2024-10-01";
      const endDate = "2024-10-10";

      db.query.mockResolvedValue([[]]); // Nenhum dado encontrado

      const response = await request(app).get(`/history?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Nenhum dado encontrado");
    });

    it("Deve retornar erro 500 se houver erro no banco", async () => {
      db.query.mockRejectedValue(new Error("Erro no banco"));

      const response = await request(app).get("/history");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

});
