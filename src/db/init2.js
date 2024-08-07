const db = require('./config');

const insertData = async () => {
  const client = await db.connect();
  console.log('Connected to the database');

  try {
    await client.query('BEGIN');

    // Limpa as tabelas antes de inserir novos dados
    await client.query('TRUNCATE TABLE generoLiterario RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE TABLE cidade RESTART IDENTITY CASCADE');
    console.log('Tables truncated');

    await client.query(`
      INSERT INTO generoLiterario (id, nome)
      VALUES
        (1, 'Ficção Literária'),
        (2, 'Novela'),
        (3, 'Suspense'),
        (4, 'Ficção Científica'),
        (5, 'Fantasia'),
        (6, 'Terror'),
        (7, 'Teatro'),
        (8, 'Romance'),
        (9, 'Infanto Juvenil'),
        (10, 'Texto Lítero Musical'),
        (11, 'Poema'),
        (12, 'Ensaio'),
        (13, 'Crônica Argumentativa'),
        (14, 'Cordel'),
        (15, 'Contos'),
        (16, 'Crônica Literária')
    `);
    console.log('Data inserted into generoLiterario');

    await client.query(`
      INSERT INTO cidade (id, nome)
      VALUES
        (1, 'Água Fria'),
        (2, 'Amélia Rodrigues'),
        (3, 'Anguera'),
        (4, 'Antônio Cardoso'),
        (5, 'Conceição da Feira'),
        (6, 'Conceição do Jacuípe'),
        (7, 'Coração de Maria'),
        (8, 'Feira de Santana'),
        (9, 'Ipecaetá'),
        (10, 'Irará'),
        (11, 'Santa Bárbara'),
        (12, 'Santanópolis'),
        (13, 'Santo Estêvão'),
        (14, 'São Gonçalo dos Campos'),
        (15, 'Tanquinho'),
        (16, 'Teodoro Sampaio'),
        (17, 'Terra Nova')
    `);
    console.log('Data inserted into cidade');

    await client.query('COMMIT');
    console.log('Transaction committed');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error executing query', e.stack);
  } finally {
    client.release();
    console.log('Client released');
  }
};

insertData();
