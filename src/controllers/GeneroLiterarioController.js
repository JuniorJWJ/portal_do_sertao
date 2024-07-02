const GeneroLiterario = require('../model/GeneroLiterario');

module.exports = {
  async get(req, res) {
    const generoLiterario = await GeneroLiterario.get();

    //return res.render("index", {generoLiterario: generoLiterario})
    return res.json({ generoLiterario: generoLiterario });
  },
  async show(req, res) {
    const generdoLiterarioId = req.params.id;
    const generoLiterario = await GeneroLiterario.show(generdoLiterarioId);

    console.log(generoLiterario);
    //return res.render("index", {generoLiterario: generoLiterario})
    return res.json({ generoLiterario: generoLiterario });
  },
};
