const Database = require('../db/config');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async get() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM obra WHERE aprovado = 1`);
    // const data = await db.all(`SELECT o.nome, o.id, o.id_genero_literario, o.endereco_pdf, a.nome as autor FROM obra o, autor a WHERE o.id_autor = a.id`)

    await db.close();

    return data.map((obra) => obra);
  },
  async getAll() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM obra`);
    // const data = await db.all(`SELECT o.nome, o.id, o.id_genero_literario, o.endereco_pdf, a.nome as autor FROM obra o, autor a WHERE o.id_autor = a.id`)

    await db.close();

    return data.map((obra) => obra);
  },
  async get_home() {
    const db = await Database();
    const data =
      await db.all(` SELECT o.nome, o.id, o.id_genero_literario, o.endereco_pdf, a.nome as autor 
                                    FROM obra o, autor a 
                                    WHERE o.id_autor = a.id
                                    ORDER BY o.id DESC
                                    LIMIT 5`);

    await db.close();

    return data.map((obra) => obra);
  },
  async create(newObra) {
    console.log(newObra);
    try {
      const db = await Database();
      const id = uuidv4();

      await db.run(`INSERT INTO obra (
                id,
                nome,
                id_autor,
                id_genero_literario,
                endereco_pdf
            ) VALUES (
                "${id}",
                "${newObra.nome}",
                "${newObra.id_autor}",
                "${newObra.id_genero_literario}",
                "${newObra.endereco_pdf || ''}"
            )`);

      await db.close();
    } catch (error) {
      console.log(error);
    }
  },
  async delete(id) {
    const db = await Database();

    await db.run(`DELETE FROM obra WHERE id = "${id}"`);

    await db.close();
  },
  async update(updatedObra, obraId) {
    const db = await Database();
    console.log('dentro do model :', updatedObra);

    await db.run(`UPDATE obra SET
        nome = "${updatedObra.nome}",
        id_autor = "${updatedObra.id_autor}",
        endereco_pdf = "${updatedObra.endereco_pdf}",
        id_genero_literario = "${updatedObra.id_genero_literario}"
        WHERE id = "${obraId}"
      `);

    await db.close();
  },
  async approv(obraId) {
    const db = await Database();
    console.log('dentro do approv:', obraId);
    await db.run(`UPDATE obra SET
            aprovado = 1
            WHERE id = "${obraId}"
          `);

    await db.close();
  },
  async show(obraId) {
    const db = await Database();

    const data = await db.all(`SELECT * FROM obra WHERE id = "${obraId}" `);

    await db.close();

    return data.map((obra) => ({
      id: obra.id,
      nome: obra.nome,
      id_autor: obra.id_autor,
      endereco_pdf: obra.endereco_pdf,
      id_genero_literario: obra.id_genero_literario,
    }));
  },
  async show_genero(idGenero) {
    const db = await Database();
    console.log(idGenero);
    const data = await db.all(
      `SELECT * FROM obra WHERE id_genero_literario = ${idGenero} AND aprovado = 1 `,
    );

    await db.close();

    return data.map((obra) => ({
      id: obra.id,
      nome: obra.nome,
      id_autor: obra.id_autor,
      endereco_pdf: obra.endereco_pdf,
      id_genero_literario: obra.id_genero_literario,
    }));
  },
  async show_autor(idAutor) {
    const db = await Database();
    console.log(idAutor);
    const data = await db.all(
      `SELECT * FROM obra WHERE id_autor = "${idAutor}" AND aprovado = 1`,
    );

    await db.close();

    return data.map((obra) => ({
      id: obra.id,
      nome: obra.nome,
      id_autor: obra.id_autor,
      endereco_pdf: obra.endereco_pdf,
      id_genero_literario: obra.id_genero_literario,
    }));
  },
};
