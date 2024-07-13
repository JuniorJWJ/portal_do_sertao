const db = require('../db/config');

module.exports = {
  async get() {
    try {
      const res = await db.query('SELECT * FROM cidade');
      return res.rows;
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
    }
  },
  async show(cidadeId) {
    try {
      const res = await db.query('SELECT * FROM cidade WHERE id = $1', [
        cidadeId,
      ]);
      return res.rows.map((cidade) => ({
        id: cidade.id,
        nome: cidade.nome,
      }));
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
    }
  },
};
