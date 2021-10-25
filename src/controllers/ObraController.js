const Obra = require('../model/obra')
const Autor = require('../model/autor')
const GeneroLiterario = require('../model/generoLiterario')

module.exports = {
    async get(req,res){
        const obra = await Obra.get()
        const autor = await Autor.get()
        const generoLiterario = await GeneroLiterario.get()

        return res.render("obra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    },
    async create(req, res) {
        await Obra.create({
            nome: req.body.nome,
            id_autor: req.body.select_autor,
            id_genero_literario: req.body.select_genero_literario,      
            endereco_pdf: req.file ? `http://localhost:3000/pdf/${req.file.filename}` : '' 
        })
        return res.redirect('/obra')
    },
    async delete(req, res) {
        const obraId = req.params.id
      
        Obra.delete(obraId)
      
        return res.redirect('/obra')
      },
      async update(req, res) {
        const obraId = req.params.id
  
        const updatedObra = {
          nome: req.body.nome,
          id_autor: req.body.select_autor,    
          id_genero_literario: req.body.select_genero_literario,       
          endereco_pdf: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
        }
        console.log("update: ", updatedObra)
        await Obra.update(updatedObra, obraId)
    
        res.redirect('/obra')
      },
  
      //exibir o que vai ser editado
      async show(req,res){
        const obraId = req.params.id
  
        const obra = await Obra.show(obraId)

        const autor = await Autor.get()
    
        return res.render("obraEdit", {obra: obra, autor: autor})
      }

}