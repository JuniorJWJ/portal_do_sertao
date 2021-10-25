const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM generoLiterario`)

        await db.close()

        
        //console.log("dentro do model :" + data)
        return data.map( generoLiterario => generoLiterario);
    }
}