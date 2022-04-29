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
    await Obra.create({
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,      
      endereco_pdf: req.file ? `http://localhost:3000/pdf/${req.file.filename}` : '' 
    })
    //return res.redirect('/lista_obra')
  },
  async delete(req, res) {
    const obraId = req.params.id
  
    Obra.delete(obraId)
  
    //return res.redirect('/lista_obra')
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
    await Obra.update(updatedObra, obraId)

    //res.redirect('/lista_obra')
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
    return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
  },
  async show_genero(req,res){
    const obraGenero = req.params.id
    console.log(obraGenero)
    const obra = await Obra.show_genero(obraGenero)
    console.log(obra)
    const autor = await Autor.get()
    const generoLiterario = await GeneroLiterario.get()

    //return res.render("FiltroObra", {obra: obra, autor: autor, generoLiterario: generoLiterario})
    return res.json({obra: obra, autor: autor, generoLiterario: generoLiterario})
  }
}