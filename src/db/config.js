require('dotenv').config(); // Certifique-se de instalar o pacote dotenv
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use variável de ambiente para a URL de conexão
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }

  client.query('SELECT now()', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log(result.rows);
  });
});

// Opcionalmente, exporte a função query para uso em outros lugares
module.exports = pool;
