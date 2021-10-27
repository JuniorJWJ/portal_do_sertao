const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM cidade `)

        await db.close()

        
        // console.log("dentro do model :" + data)
        return data.map( cidade => cidade);
    },
    async show(cidadeId){
        const db = await Database()

        const data = await db.all(`SELECT * FROM cidade WHERE id = ${cidadeId} `)

        await db.close()

        return data.map( cidade =>({ 
            id: cidade.id,
            nome: cidade.nome
        }))
    },
}