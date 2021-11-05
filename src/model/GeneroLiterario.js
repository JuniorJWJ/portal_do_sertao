const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM generoLiterario`)

        await db.close()

        return data.map( generoLiterario => generoLiterario);
    },
    async show(generoId){
        const db = await Database()

        const data = await db.all(`SELECT * FROM generoLiterario WHERE id = ${generoId} `)

        await db.close()

        return data.map( generoLiterario =>({ 
            id: generoLiterario.id,
            nome: generoLiterario.nome
        }))
    },
}