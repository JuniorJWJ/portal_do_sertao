const Autor = require('../model/autor')
const Cidade = require('../model/cidade')

module.exports = {
    async get(req,res){
      const autor = await Autor.get()
      const cidade = await Cidade.get()

      return res.render("listaAutor", {autor: autor, cidade: cidade})
    },
    async create(req, res) {
      await Autor.create({
        nome: req.body.nome,
        profissao: req.body.profissao,
        biografia: req.body.biografia,
        email: req.body.email,
        id_cidade: req.body.select_cidade,
        genero: req.body.select_genero,        
        endereco_foto: req.file ? `http://localhost:3000/images/${req.file.filename}` : '' 
      })
      return res.redirect('/lista_autor')
    },
    async delete(req, res) {
      const autorId = req.params.id
    
      Autor.delete(autorId)
    
      return res.redirect('/lista_autor')
    },
    async update(req, res) {
      const autorId = req.params.id

      const updatedAutor = {
        nome: req.body.nome,
        profissao: req.body.profissao,
        biografia: req.body.biografia,        
        email: req.body.email,
        id_cidade: req.body.select_cidade,
        genero: req.body.select_genero,  
        endereco_foto: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
      }
      console.log(updatedAutor,"id = "+ autorId)
      await Autor.update(updatedAutor, autorId)
  
      res.redirect('/lista_autor')
    },
    //exibir o que vai ser editado
    async show_edit(req,res){
      const autorId = req.params.id

      const autor = await Autor.show(autorId)
      
      const cidade = await Cidade.get()

  
      return res.render("autorEdit", {autor: autor, cidade: cidade})
    },
    //exibir o que vai ser editado
    async show(req,res){
      const autorId = req.params.id

      const autor = await Autor.show(autorId)
      const id_cidade = autor.map(autor => autor.id_cidade)
      console.log(id_cidade)
      const cidade = await Cidade.show(id_cidade)
  
      return res.render("Autor", {autor: autor, cidade: cidade})
    }
}