const Cidade = require('../model/cidade')

module.exports = {
    async get(req,res){
      const cidade = await Cidade.get()

      //return res.render("index", {cidade: cidade})
      return res.json({cidade: cidade})
    }
}