const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./routes/authRoutes'); // Certifique-se de que o caminho está correto
const devicesRoutes = require('./routes/devicesRoutes');
const measuresRoutes = require('./routes/measuresRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Usando as rotas
app.use('/auth', authRoutes);
app.use('/devices', devicesRoutes);
app.use('/measures', measuresRoutes);
app.use('/events', eventsRoutes);
app.use('/dashboard', dashboardRoutes);

// Aqui, em vez de chamar app.listen(), exporte o app para os testes
if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
  });
}

module.exports = app; // Exporte o app para uso nos testes
