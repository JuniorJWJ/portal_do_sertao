const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do Pool de conexão
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Apenas se estiver usando SSL localmente
  }
});

module.exports = {
  async get() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM generoLiterario ORDER BY nome
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching generoLiterario:', error);
      throw error;
    }
  },
  
  async show(generoId) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM generoLiterario WHERE id = $1
      `;
      const values = [generoId];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map(generoLiterario => ({
        id: generoLiterario.id,
        nome: generoLiterario.nome
      }));
    } catch (error) {
      console.error(`Error fetching generoLiterario with id ${generoId}:`, error);
      throw error;
    }
  }
};
