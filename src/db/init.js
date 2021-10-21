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
            biografia TEXT
        )`);

        await db.exec(`CREATE TABLE obra (
            id INTEGER PRIMARY KEY,
            nome VARCHAR,
            endereco_pdf VARCHAR,
            id_autor INTEGER,
            FOREIGN KEY (id_autor) REFERENCES autor(id)
        )`);

        await db.close()
    }
}

initDb.init();



