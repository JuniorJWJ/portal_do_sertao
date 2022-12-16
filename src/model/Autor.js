const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM autor `)

        await db.close()

        return data.map( autor => autor);
    },
    async create(newAutor){
        //console.log(newAutor)
        try {
            const db = await Database()

            await db.run(`INSERT INTO autor (
                nome,
                profissao,
                biografia,
                email,
                endereco_foto,
                genero,
                id_cidade
            ) VALUES (
                "${newAutor.nome}",
                "${newAutor.profissao}",
                "${newAutor.biografia}",
                "${newAutor.email || ''}",
                "${newAutor.endereco_foto || ''}",
                "${newAutor.genero}",
                "${newAutor.id_cidade}"
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
    async update(updatedAutor, autorId) {
        const db = await Database()

        await db.run(`UPDATE autor SET
        nome = "${updatedAutor.nome}",
        profissao = "${updatedAutor.profissao}",
        biografia = "${updatedAutor.biografia}",
        email = "${updatedAutor.email}",
        endereco_foto = "${updatedAutor.endereco_foto}",
        genero = "${updatedAutor.genero}",
        id_cidade = "${updatedAutor.id_cidade}"
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
            biografia: autor.biografia,
            email: autor.email,
            endereco_foto: autor.endereco_foto,
            genero: autor.genero,
            id_cidade: autor.id_cidade
        }))
    },
    async show_cidade(idCidade){
        const db = await Database()
        console.log(idCidade)
        const data = await db.all(`SELECT * FROM autor WHERE id_cidade = ${idCidade} `)

        await db.close()

        return data.map( autor =>({ 
            id: autor.id,
            nome: autor.nome,
            profissao: autor.profissao,
            biografia: autor.biografia,
            email: autor.email,
            endereco_foto: autor.endereco_foto,
            genero: autor.genero,
            id_cidade: autor.id_cidade
        }))
    },
}