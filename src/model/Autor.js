const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
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
        SELECT * FROM autor WHERE aprovado = 1
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching autor aprovado:', error);
      throw error;
    }
  },
  
  async get_all() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM autor
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error('Error fetching all autores:', error);
      throw error;
    }
  },
  
  async create(newAutor) {
    try {
      const client = await pool.connect();
      const id = uuidv4();
      const query = `
        INSERT INTO autor (id, nome, profissao, biografia, email, endereco_foto, genero, id_cidade, password, adm, aprovado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      const values = [
        id,
        newAutor.nome,
        newAutor.profissao,
        newAutor.biografia,
        newAutor.email || '',
        newAutor.endereco_foto || '',
        newAutor.genero,
        newAutor.id_cidade,
        newAutor.password,
        0,
        0
      ];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error creating autor:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const client = await pool.connect();
      const query = `
        DELETE FROM autor WHERE id = $1
      `;
      const values = [id];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error deleting autor:', error);
      throw error;
    }
  },
  
  async update(updatedAutor, autorId) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE autor SET
        nome = $1,
        profissao = $2,
        email = $3,
        endereco_foto = $4,
        biografia = $5,
        genero = $6,
        id_cidade = $7
        WHERE id = $8
      `;
      const values = [
        updatedAutor.nome,
        updatedAutor.profissao,
        updatedAutor.email,
        updatedAutor.endereco_foto,
        updatedAutor.biografia,
        updatedAutor.genero,
        updatedAutor.id_cidade,
        autorId
      ];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error updating autor:', error);
      throw error;
    }
  },
  
  async approv(autorId) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE autor SET
        aprovado = 1
        WHERE id = $1
      `;
      const values = [autorId];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error('Error approving autor:', error);
      throw error;
    }
  },
  
  async show(autorId) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM autor WHERE id = $1
      `;
      const values = [autorId];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map(autor => ({
        id: autor.id,
        nome: autor.nome,
        profissao: autor.profissao,
        email: autor.email,
        endereco_foto: autor.endereco_foto,
        biografia: autor.biografia,
        genero: autor.genero,
        id_cidade: autor.id_cidade,
        adm: autor.adm,
        aprovado: autor.aprovado
      }));
    } catch (error) {
      console.error('Error fetching autor by id:', error);
      throw error;
    }
  },
  
  async show_cidade(idCidade) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM autor WHERE id_cidade = $1
      `;
      const values = [idCidade];
      const { rows } = await client.query(query, values);
      client.release();
      return rows.map(autor => ({
        id: autor.id,
        nome: autor.nome,
        profissao: autor.profissao,
        email: autor.email,
        endereco_foto: autor.endereco_foto,
        biografia: autor.biografia,
        genero: autor.genero,
        id_cidade: autor.id_cidade,
        adm: autor.adm,
        aprovado: autor.aprovado
      }));
    } catch (error) {
      console.error('Error fetching autores by cidade:', error);
      throw error;
    }
  },
  
  async show_email(email) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM autor WHERE email = $1
      `;
      const values = [email];
      const { rows } = await client.query(query, values);
      client.release();
      if (rows.length === 0) {
        return '';
      } else {
        return rows.map(autor => ({
          id: autor.id,
          nome: autor.nome,
          profissao: autor.profissao,
          email: autor.email,
          endereco_foto: autor.endereco_foto,
          biografia: autor.biografia,
          genero: autor.genero,
          id_cidade: autor.id_cidade,
          adm: autor.adm,
          aprovado: autor.aprovado,
          password: autor.password
        }));
      }
    } catch (error) {
      console.error('Error fetching autor by email:', error);
      throw error;
    }
  }
};
