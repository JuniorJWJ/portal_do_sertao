const Database = require('../db/config')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM obra`)

        await db.close()

        
        //console.log("dentro do model :" + data)
        return data.map( obra => obra);
    },
    async create(newObra){
        console.log(newObra)
        try {
            const db = await Database()

            await db.run(`INSERT INTO obra (
                nome,
                id_autor,
                id_genero_literario,
                endereco_pdf
            ) VALUES (
                "${newObra.nome}",
                "${newObra.id_autor}",
                "${newObra.id_genero_literario}",
                "${newObra.endereco_pdf || ''}"
            )`)

            await db.close()
        } catch (error) {
            console.log(error);
        }
    },
    async delete(id){
        const db = await Database()

        await db.run(`DELETE FROM obra WHERE id = ${id}`)

        await db.close()
    },
    async update(updatedObra, obraId) {
        const db = await Database()
        

        await db.run(`UPDATE obra SET
        nome = "${updatedObra.nome}",
        id_autor = "${updatedObra.id_autor}",
        endereco_pdf = "${updatedObra.endereco_pdf}",
        id_genero_literario = "${updatedObra.id_genero_literario}"
        WHERE id = ${obraId }
      `)

      await db.close()
    },
    async show(obraId){
        const db = await Database()

        const data = await db.all(`SELECT * FROM obra WHERE id = ${obraId} `)

        await db.close()

        return data.map( obra =>({ 
            id: obra.id,
            nome: obra.nome,
            id_autor: obra.id_autor,
            endereco_pdf: obra.endereco_pdf,
            id_genero_literario: obra.id_genero_literario,
        }))
    },
    async show_genero(idGenero){
        const db = await Database()
        console.log(idGenero)
        const data = await db.all(`SELECT * FROM obra WHERE id_genero_literario = ${idGenero} `)

        await db.close()

        return data.map( obra =>({ 
            id: obra.id,
            nome: obra.nome,
            id_autor: obra.id_autor,
            endereco_pdf: obra.endereco_pdf,
            id_genero_literario: obra.id_genero_literario,
        }))
    },
}