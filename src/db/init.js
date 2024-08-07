const db = require('./config');

const initDb = {
  async init() {
    const client = await db.connect();
    console.log('Connected to the database');

    try {
      await client.query('BEGIN');

      await client.query(`
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      `);
      console.log('Extension pgcrypto checked/created');

      await client.query(`
        CREATE TABLE IF NOT EXISTS cidade (
          id SERIAL PRIMARY KEY,
          nome VARCHAR
        )
      `);
      console.log('Table cidade checked/created');

      await client.query(`
        CREATE TABLE IF NOT EXISTS generoLiterario (
          id SERIAL PRIMARY KEY,
          nome VARCHAR
        )
      `);
      console.log('Table generoLiterario checked/created');

      await client.query(`
        CREATE TABLE IF NOT EXISTS autor (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR,
          profissao VARCHAR,
          biografia TEXT,            
          email VARCHAR,
          endereco_foto VARCHAR,
          genero VARCHAR,
          cor_de_pele VARCHAR,
          id_cidade INTEGER,
          password VARCHAR(255),
          adm INTEGER,
          aprovado INTEGER DEFAULT 0,
          FOREIGN KEY (id_cidade) REFERENCES cidade(id)
        )
      `);
      console.log('Table autor checked/created');

      await client.query(`
        CREATE TABLE IF NOT EXISTS obra (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR,
          endereco_pdf VARCHAR,
          id_autor UUID,
          id_genero_literario INTEGER,
          aprovado INTEGER DEFAULT 0, -- Define o valor padrão como 0
          FOREIGN KEY (id_genero_literario) REFERENCES generoLiterario(id),
          FOREIGN KEY (id_autor) REFERENCES autor(id)
        )
      `);
      console.log('Table obra checked/created');

      await client.query('COMMIT');
      console.log('Transaction committed');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error executing query', e.stack);
    } finally {
      client.release();
      console.log('Client released');
    }
  },
};

initDb.init();
