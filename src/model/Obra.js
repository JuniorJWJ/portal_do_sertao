const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM obra`)

        await db.close()

        console.log("dentro do model :" + data)
        return data.map( obra => obra);
    },
    async create(newObra){
        console.log(newObra)
        try {
            const db = await Database()

            await db.run(`INSERT INTO obra (
                nome,
                id_autor,
                endereco_pdf
            ) VALUES (
                "${newObra.nome}",
                "${newObra.id_autor}",
                "${newObra.endereco_pdf || ''}"
            )`)

            await db.close()
        } catch (error) {
            console.log(error);
        }
    }
}