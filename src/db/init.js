const db = require('./config');

const initDb = {
  async init() {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      await client.query(`
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS cidade (
          id SERIAL PRIMARY KEY,
          nome VARCHAR
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS generoLiterario (
          id SERIAL PRIMARY KEY,
          nome VARCHAR
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS autor (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR,
          profissao VARCHAR,
          biografia TEXT,            
          email VARCHAR,
          endereco_foto VARCHAR,
          genero VARCHAR,
          id_cidade INTEGER,
          password VARCHAR(255),
          adm INTEGER,
          aprovado INTEGER DEFAULT 0,
          FOREIGN KEY (id_cidade) REFERENCES cidade(id)
        )
      `);

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

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error executing query', e.stack);
    } finally {
      client.release();
    }
  },
};

initDb.init();
