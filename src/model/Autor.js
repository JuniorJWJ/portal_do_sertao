const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM autor `)

        await db.close()

        return data.map( autor => autor);
    },
    async create(newAutor){
        console.log(newAutor)
        try {
            const db = await Database()

            await db.run(`INSERT INTO autor (
                nome,
                profissao,
                biografia,
                email,
                endereco_foto
            ) VALUES (
                "${newAutor.nome}",
                "${newAutor.profissao}",
                "${newAutor.biografia}",
                "${newAutor.email || ''}",
                "${newAutor.endereco_foto || ''}"
            )`)

            await db.close()
        } catch (error) {
            console.log(error);
        }
        

    },
    async delete(id){
        const db = await Database()

        await db.run(`DELETE FROM autor WHERE id = ${id}`)

        await db.close()
    },
    async update(updatedList, autorId) {
        const db = await Database()
        
        await db.run(`UPDATE autor SET
        nome = "${updatedList.nome}",
        profissao = "${updatedList.profissao}",
        biografia = "${updatedList.biografia}",
        WHERE id = ${autorId}
      `)

      await db.close()
    },
    async show(autorId){
        const db = await Database()

        const data = await db.all(`SELECT * FROM autor WHERE id = ${autorId} `)

        await db.close()

        return data.map( autor =>({ 
            id: autor.id,
            nome: autor.nome,
            profissao: autor.profissao,
            biografia: autor.biografia
        }))
    },
}