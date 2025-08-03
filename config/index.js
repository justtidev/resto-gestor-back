require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    schema: process.env.DB_NAME,
    dialect: 'mysql',
  },
  mercadoPago: {},
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};


