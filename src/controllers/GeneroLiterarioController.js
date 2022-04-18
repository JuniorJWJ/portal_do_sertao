const GeneroLiterario = require('../model/generoLiterario')

module.exports = {
    async get(req,res){
      const generoLiterario = await GeneroLiterario.get()

      //return res.render("index", {generoLiterario: generoLiterario})
      return res.json({generoLiterario: generoLiterario})
    }
}