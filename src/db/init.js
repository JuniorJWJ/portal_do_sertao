const Database = require("./config")

const initDb = {
    async init(){
        const db = await Database()

        await db.exec(`CREATE TABLE autor (
            id INTEGER PRIMARY KEY,
            nome VARCHAR,
            profissao VARCHAR,
            email VARCHAR,
            endereco_foto VARCHAR,
            biografia TEXT,
            genero VARCHAR,
            id_cidade INTEGER,
            FOREIGN KEY (id_cidade) REFERENCES cidade(id)
        )`);

        await db.exec(`CREATE TABLE obra (
            id INTEGER PRIMARY KEY,
            nome VARCHAR,
            endereco_pdf VARCHAR,
            id_autor INTEGER,
            id_genero_literario INTEGER,
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

        await db.exec(`CREATE TABLE user (
            id INTEGER PRIMARY KEY,
            nome varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NULL,
            createdAt datetime NOT NULL,
            updatedAt datetime NOT NULL
        )`);

        await db.close()
    }
}

initDb.init();



