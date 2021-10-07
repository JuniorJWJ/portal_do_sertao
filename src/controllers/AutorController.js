const Autor = require('../model/autor')

module.exports = {
    async get(req,res){
      const autor = await Autor.get()

      return res.render("index", {autor: autor})
    },
    async create(req, res) {
      await Autor.create({
        nome: req.body.nome,
        profissao: req.body.profissao,
        biografia: req.body.biografia
      })
      return res.redirect('/')
    },
    async delete(req, res) {
      const autorId = req.params.id
    
      Autor.delete(autorId)
    
      return res.redirect('/')
    },
    async update(req, res) {
      const autorId = req.params.id
      console.log("autorId")
      console.log(autorId)

      const updatedAutor = {
        nome: req.body.nome,
        profissao: req.body.profissao,
        biografia: req.body.biografia,
      }
      console.log(updatedAutor, autorId)
      await Autor.update(updatedAutor, autorId)
  
      res.redirect('/')
    },

    //exibir o que vai ser editado
    async show(req,res){
      const autorId = req.params.id

      const autor = await Autor.show(autorId)
  
      return res.render("autorEdit", {autor: autor})
    }
}