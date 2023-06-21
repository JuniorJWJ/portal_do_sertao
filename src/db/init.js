const Database = require("./config");

const initDb = {
  async init() {
    const db = await Database();

    await db.exec(`CREATE TABLE autor (
            id VARCHAR PRIMARY KEY,
            nome VARCHAR,
            profissao VARCHAR,
            biografia TEXT,            
            email VARCHAR,
            endereco_foto VARCHAR,
            genero VARCHAR,
            id_cidade INTEGER,
            password varchar(255) NULL,
            adm INTEGER,
            pendente INTEGER,
            FOREIGN KEY (id_cidade) REFERENCES cidade(id)
        )`);

    await db.exec(`CREATE TABLE obra (
            id INTEGER PRIMARY KEY,
            nome VARCHAR,
            endereco_pdf VARCHAR,
            id_autor INTEGER,
            id_genero_literario INTEGER,
            pendente INTEGER,
            FOREIGN KEY (id_genero_literario) REFERENCES generoLiterario(id)
            FOREIGN KEY (id_autor) REFERENCES autor(id)
        )`);

    await db.exec(`CREATE TABLE cidade (
            id INTEGER PRIMARY KEY,
            nome VARCHAR
        )`);

    await db.exec(`CREATE TABLE generoLiterario (
            id INTEGER PRIMARY KEY,
            nome VARCHAR
        )`);

    await db.close();
  },
};

initDb.init();
