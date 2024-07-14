const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do Pool de conexão
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Apenas se estiver usando SSL localmente
  },
});

module.exports = {
  async get() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM obra WHERE aprovado = 1
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching obras:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM obra
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching all obras:', error);
      throw error;
    }
  },

  async get_home() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT o.nome, o.id, o.id_genero_literario, o.endereco_pdf, a.nome as autor 
        FROM obra o 
        JOIN autor a ON o.id_autor = a.id
        ORDER BY o.id DESC
        LIMIT 5
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching obras for home:', error);
      throw error;
    }
  },

  async create(newObra) {
    try {
      const client = await pool.connect();
      const id = uuidv4();
      console.log(id);
      const query = `
            INSERT INTO obra (
                id,
                nome,
                id_autor,
                id_genero_literario,
                endereco_pdf
            ) VALUES (
                $1, $2, $3, $4, $5
            )
        `;
      const values = [
        id,
        newObra.nome,
        newObra.id_autor,
        newObra.id_genero_literario,
        newObra.endereco_pdf || '', // Certifique-se de que endereco_pdf nunca seja null
      ];
      console.log(values);
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error creating obra:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const client = await pool.connect();
      const query = `
        DELETE FROM obra WHERE id = $1
      `;
      const values = [id];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error deleting obra:', error);
      throw error;
    }
  },

  async update(updatedObra, obraId) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE obra SET
        nome = $1,
        id_autor = $2,
        endereco_pdf = $3,
        id_genero_literario = $4,
        aprovado = 0
        WHERE id = $5
      `;
      const values = [
        updatedObra.nome,
        updatedObra.id_autor,
        updatedObra.endereco_pdf,
        updatedObra.id_genero_literario,
        obraId,
      ];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error updating obra:', error);
      throw error;
    }
  },

  async approv(obraId) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE obra 
        SET aprovado = CASE 
          WHEN aprovado = 0 THEN 1 
          ELSE 0 
        END 
        WHERE id = $1
      `;
      const values = [obraId];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error approving obra:', error);
      throw error;
    }
  },

  async show(obraId) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM obra WHERE id = $1
      `;
      const values = [obraId];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map((obra) => ({
        id: obra.id,
        nome: obra.nome,
        id_autor: obra.id_autor,
        endereco_pdf: obra.endereco_pdf,
        id_genero_literario: obra.id_genero_literario,
      }));
    } catch (error) {
      console.error('Error fetching obra:', error);
      throw error;
    }
  },

  async show_genero(idGenero) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM obra WHERE id_genero_literario = $1 AND aprovado = 1
      `;
      const values = [idGenero];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map((obra) => ({
        id: obra.id,
        nome: obra.nome,
        id_autor: obra.id_autor,
        endereco_pdf: obra.endereco_pdf,
        id_genero_literario: obra.id_genero_literario,
      }));
    } catch (error) {
      console.error('Error fetching obras by genero:', error);
      throw error;
    }
  },

  async show_autor(idAutor) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM obra WHERE id_autor = $1 AND aprovado = 1
      `;
      const values = [idAutor];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map((obra) => ({
        id: obra.id,
        nome: obra.nome,
        id_autor: obra.id_autor,
        endereco_pdf: obra.endereco_pdf,
        id_genero_literario: obra.id_genero_literario,
        aprovado: obra.aprovado,
      }));
    } catch (error) {
      console.error('Error fetching obras by autor:', error);
      throw error;
    }
  },
};
