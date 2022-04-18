const Obra = require('../model/obra')
const Autor = require('../model/autor')
const GeneroLiterario = require('../model/generoLiterario')

module.exports = {
    async get(req,res){
      const obra = await Obra.get_home()
      const autor = await Autor.get()
      const generoLiterario = await GeneroLiterario.get()

      // return res.render("index", {obra: obra})
      return res.json({obra: obra})
    }
}