const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./routes/authRoutes'); // Certifique-se de que o caminho está correto
const devicesRoutes = require('./routes/devicesRoutes');
const measuresRoutes = require('./routes/measuresRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const climateRoutes = require("./routes/climateRoutes");

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Usando as rotas
app.use('/auth', authRoutes);
app.use('/devices', devicesRoutes);
app.use('/measures', measuresRoutes);
app.use('/events', eventsRoutes);
app.use('/dashboard', dashboardRoutes);
// Middleware para as rotas de climate_data
app.use("/climate", climateRoutes);


app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
