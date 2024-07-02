const Obra = require('../model/Obra');
const Autor = require('../model/Autor');
const GeneroLiterario = require('../model/GeneroLiterario');

module.exports = {
  async get(req, res) {
    const obra = await Obra.get_home();
    const autor = await Autor.get();
    const generoLiterario = await GeneroLiterario.get();

    // return res.render("index", {obra: obra})
    return res.json({ obra: obra });
  },
};
