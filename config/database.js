require("dotenv").config();
const { Sequelize } = require("sequelize");

const usingDatabaseUrl = Boolean(process.env.DATABASE_URL);

const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    database: process.env.DB_NAME || "textile_stock",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: "postgres",
  },
  {
    logging: false,
    dialectOptions: usingDatabaseUrl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);

module.exports = sequelize;