const Obra = require('../model/obra')
const Autor = require('../model/autor')
const GeneroLiterario = require('../model/generoLiterario')

module.exports = {
  async get(req,res){
    const obra = await Obra.get()
    const autor = await Autor.get()
    const generoLiterario = await GeneroLiterario.get()

    // return res.render("listaObra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    // return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra})
  },
  async create_obra_get(req,res){
    const obra = await Obra.get()
    const autor = await Autor.get()
    const generoLiterario = await GeneroLiterario.get()
    
    //return res.render("createObra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
  },
  async create(req, res) {
    const obra = ({
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,      
      endereco_pdf: req.file ? `http://localhost:3000/pdf/${req.file.filename}` : '' 
    })
    try{
      await Obra.create(obra)
      res.status(201).json({msg: 'Obra created sucessfully', obra})
    } catch (error) {
      console.log(error)
      res.status(500).json({msg: 'Fail in Server '})
    }
  },
  async delete(req, res) {
    const obraId = req.params.id

    try{
      await Obra.delete(obraId)
      res.status(200).json({msg: 'Obra deleted successfully'})
    } catch (error) {
      res.status(500).json({msg: 'Fail in delete Autor'})
    }
  },
  async update(req, res) {
    const obraId = req.params.id

    var updatedObra = {
      nome: req.body.nome,
      id_autor: req.body.select_autor,    
      id_genero_literario: req.body.select_genero_literario,       
      endereco_pdf: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
    }
    if(!updatedObra.endereco_pdf){
      var ObraBDteste = await Obra.show(obraId)
      updatedObra.endereco_pdf = ObraBDteste[0].endereco_pdf
    }
    //console.log("update: ", updatedObra)
    // await Obra.update(updatedObra, obraId)
    
    //res.redirect('/lista_obra')
    try{
      await Obra.update(updatedObra, obraId)
      res.status(201).json({msg: 'Obra update sucessfully'})
    } catch (error) {
      res.status(500).json({msg: 'Fail in Server '})
      console.log(error)
    }
  },
  //exibir o que vai ser editado
  async show_edit(req,res){
    const obraId = req.params.id

    const obra = await Obra.show(obraId)
    const generoLiterario = await GeneroLiterario.get()
    const autor = await Autor.get()

    //return res.render("obraEdit", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
  },
  async show(req,res){
    const obraId = req.params.id
    console.log(obraId)
    const obra = await Obra.show(obraId)
    console.log(obra)
    const id_genero_literario = obra.map(obra => obra.id_genero_literario)
    console.log(id_genero_literario)
    const id_autor = obra.map(obra => obra.id_autor)
    console.log(id_autor)
    const generoLiterario = await GeneroLiterario.show(id_genero_literario)
    console.log(generoLiterario)
    const autor = await Autor.show(id_autor)

    //return res.render("Obra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    // return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra})
  },
  async show_genero(req,res){
    const obraGenero = req.params.id
    console.log(obraGenero)
    const obra = await Obra.show_genero(obraGenero)
    console.log(obra)
    const autor = await Autor.get()
    const generoLiterario = await GeneroLiterario.get()

    //return res.render("FiltroObra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    // return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra})
  }
}