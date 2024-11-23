module.exports = {
    dbConfig: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "admin",
      database: process.env.DB_NAME || "smartlettuce",
    },
    SECRET_KEY: process.env.SECRET_KEY || "your_secret_key"
  };
  