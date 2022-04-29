const Autor = require('../model/autor')
const Cidade = require('../model/cidade')

module.exports = {
  async get(req,res){
    const autor = await Autor.get()
    const cidade = await Cidade.get()

    //return res.render("listaAutor", {autor: autor, cidade: cidade})
    //return res.json({autor: autor, cidade: cidade})
    return res.json({autor: autor, cidade: cidade})
  },
  async create_autor_get(req,res){
    const autor = await Autor.get()
    const cidade = await Cidade.get()

    return res.render("createAutor", {autor: autor, cidade: cidade})
  },
  async create(req, res) {

    // await Autor.create({
    //   nome: req.body.nome,
    //   profissao: req.body.profissao,
    //   biografia: req.body.biografia,
    //   email: req.body.email,
    //   id_cidade: req.body.select_cidade,
    //   genero: req.body.select_genero,        
    //   endereco_foto: req.file ? `http://localhost:3000/images/${req.file.filename}` : '' 
    // })

    //return res.redirect('/lista_autor')

    const autor = ({
      nome: req.body.nome,
      profissao: req.body.profissao,
      biografia: req.body.biografia,
      email: req.body.email,
      id_cidade: req.body.id_cidade,
      genero: req.body.genero,        
      endereco_foto: req.file ? `http://localhost:3000/images/${req.file.filename}` : '' 
    })
    try{
      await Autor.create(autor)
      res.status(201).json({msg: 'User created sucessfully', autor})
    } catch (error) {
      console.log(error)
      res.status(500).json({msg: 'Fail in Server '})
    }
  },
  async delete(req, res) {
    const autorId = req.params.id
  
    // Autor.delete(autorId)
  
    // return res.redirect('/lista_autor')
    try{
      await Autor.delete(autorId)
      res.status(200).json({msg: 'Autor deleted successfully'})
    } catch (error) {
      res.status(500).json({msg: 'Fail in delete Autor'})
    }
  },
  async update(req, res) {
    const autorId = req.params.id

    var updatedAutor = {
      nome: req.body.nome,
      profissao: req.body.profissao,
      biografia: req.body.biografia,        
      email: req.body.email,
      id_cidade: req.body.id_cidade,
      genero: req.body.genero,  
      endereco_foto: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
    }
    if(!updatedAutor.endereco_foto){
      var AutorBDteste = await Autor.show(autorId)
      updatedAutor.endereco_foto = AutorBDteste[0].endereco_foto
    }
    console.log(updatedAutor,"id = "+ autorId)
    
    try{
      await Autor.update(updatedAutor, autorId)
      res.status(201).json({msg: 'Author update sucessfully'})
    } catch (error) {
      // res.status(500).json({msg: 'Fail in Server '})
      console.log(error)
    }

    // res.redirect('/lista_autor')
  },
  //exibir o que vai ser editado
  async show_edit(req,res){
    const autorId = req.params.id

    const autor = await Autor.show(autorId)
    
    const cidade = await Cidade.get()


    // return res.render("autorEdit", {autor: autor, cidade: cidade})
  },
  //exibir o que vai ser editado
  async show(req,res){
    const autorId = req.params.id

    const autor = await Autor.show(autorId)
    const id_cidade = autor.map(autor => autor.id_cidade)
    // console.log(id_cidade)
    const cidade = await Cidade.show(id_cidade)

    // return res.render("Autor", {autor: autor, cidade: cidade})
    //return res.json({autor: autor, cidade: cidade})
    return res.json({autor: autor})
  }
}