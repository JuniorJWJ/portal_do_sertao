const Obra = require('../model/obra')
const Autor = require('../model/autor')

module.exports = {
    async get(req,res){
        const obra = await Obra.get()
        const autor = await Autor.get()

        console.log(autor)

        return res.render("obra", {obra: obra, autor: autor})
    },
    async create(req, res) {
        await Obra.create({
            nome: req.body.nome,
            id_autor: req.body.profissao,
            endereco_pdf: req.file ? `http://localhost:3000/pdf/${req.file.filename}` : '' 
        })
        return res.redirect('/obra')
    },

}