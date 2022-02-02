const Database = require('../db/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user`)

        await db.close()

        return data.map( user => user);
    },
    async create(newUser){
        //console.log(newAutor)
        try {
            const db = await Database()

            await db.run(`INSERT INTO user (
                nome,
                email,
                password
            ) VALUES (
                "${newUser.nome}",
                "${newUser.email}",
                "${newUser.password}"
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
    async show(userEmail){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user WHERE email = "${userEmail}" `)

        await db.close()

        return data.map( user =>({ 
            id: user.id,
            nome: user.nome,
            password: user.password,
            email: user.email,
        }))
    },
}