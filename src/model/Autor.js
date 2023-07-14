const Database = require('../db/config');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async get() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM autor WHERE aprovado = 1`);

    await db.close();

    return data.map((autor) => autor);
  },
  async get_all() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM autor`);

    await db.close();

    return data.map((autor) => autor);
  },
  async create(newAutor) {
    //console.log(newAutor)
    console.log(newAutor.password);
    const id = uuidv4();
    try {
      const db = await Database();
      console.log(id);
      await db.run(`INSERT INTO autor (
                id,
                nome,
                profissao,
                biografia,
                email,
                endereco_foto,
                genero,
                id_cidade,
                password,
                adm,
                aprovado
            ) VALUES (
                "${id}",
                "${newAutor.nome}",
                "${newAutor.profissao}",
                "${newAutor.biografia}",
                "${newAutor.email || ''}",
                "${newAutor.endereco_foto || ''}",
                "${newAutor.genero}",
                "${newAutor.id_cidade}",
                "${newAutor.password}",
                "0", 
                "0"
            )`);

      await db.close();
    } catch (error) {
      console.log(error);
    }
  },
  async delete(id) {
    const db = await Database();

    await db.run(`DELETE FROM autor WHERE id = "${id}"`);

    await db.close();
  },
  async update(updatedAutor, autorId) {
    const db = await Database();
    console.log('dentro do update:', updatedAutor);
    await db.run(`UPDATE autor SET
    nome = "${updatedAutor.nome}",
    profissao = "${updatedAutor.profissao}",
    email = "${updatedAutor.email}",
    endereco_foto = "${updatedAutor.endereco_foto}",
    biografia = "${updatedAutor.biografia}",
    genero = "${updatedAutor.genero}",
    id_cidade = "${updatedAutor.id_cidade}"
    WHERE id = "${autorId}"
  `);

    await db.close();
  },
  async approv(autorId) {
    const db = await Database();
    console.log('dentro do approv:', autorId);
    await db.run(`UPDATE autor SET
        aprovado = 1
        WHERE id = "${autorId}"
      `);

    await db.close();
  },
  async show(autorId) {
    console.log('entrou no show:', autorId);
    const db = await Database();

    const data = await db.all(`SELECT * FROM autor WHERE id = "${autorId}"`);
    if (data.length === 0) {
      console.log('erro');
    }
    await db.close();
    console.log(data);
    return data.map((autor) => ({
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
    }));
  },
  async show_cidade(idCidade) {
    const db = await Database();
    console.log(idCidade);
    const data = await db.all(
      `SELECT * FROM autor WHERE id_cidade = ${idCidade} `,
    );

    await db.close();

    return data.map((autor) => ({
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
    }));
  },
  async show_email(email) {
    const db = await Database();
    const data = await db.all(`SELECT * FROM autor WHERE email = "${email}" `);
    console.log(data);
    await db.close();

    if (data.length == 0) {
      return '';
    } else {
      return data.map((autor) => ({
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
        password: autor.password,
      }));
    }
  },
};
