const Database = require("./config")

const initDb = {
    async init(){
        const db = await Database()

        await db.exec(`CREATE TABLE autor (
            id INTEGER PRIMARY KEY,
            nome VARCHAR,
            profissao VARCHAR,
            biografia TEXT
        )`);

        await db.close()
    }
}

initDb.init();



