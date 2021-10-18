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
            id_autor INTEGER,
            endereco_pdf VARCHAR
        )`);

        await db.close()
    }
}

initDb.init();



