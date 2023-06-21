const Obra = require("../model/obra");
const Autor = require("../model/autor");
const GeneroLiterario = require("../model/generoLiterario");

module.exports = {
  async get(req, res) {
    const obra = await Obra.get();
    return res.json({ obra: obra });
  },

  async create(req, res) {
    if (
      req.body.nome == "" ||
      req.body.select_autor == "" ||
      req.body.select_genero_literario == "" ||
      req.body.file == ""
    ) {
      return res
        .status(500)
        .json({ msg: "Preencha todos os dados para completar o cadastro" });
    }
    const obra = {
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,
      endereco_pdf: req.file
        ? `http://localhost:3000/pdf/${req.file.filename}`
        : "",
    };
    try {
      await Obra.create(obra);
      res.status(201).json({ msg: "Obra registrada com sucesso!", obra });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao registrar o obra no sistema!" });
    }
  },
  async delete(req, res) {
    const obraId = req.params.id;

    if (obraId === "" || obraId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }

    try {
      const obra = await Obra.show(obraId);
      console.log(obra);

      if (obra.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum obra encontrado!",
        });
      }

      await Obra.delete(obraId);
      res.status(200).json({ msg: "Obra deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: "Falha ao deletar o obra" });
    }
  },
  async update(req, res) {
    const obraId = req.params.id;
    console.log(obraId);

    var updatedObra = {
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,
      endereco_pdf: req.file
        ? `http://localhost:3000/images/${req.file.filename}`
        : "",
    };

    if (obraId === "" || obraId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }

    try {
      const obra = await Obra.show(obraId);
      console.log(obra);

      if (obra.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhuma obra encontrada!",
        });
      }

      if (!updatedObra.endereco_pdf) {
        var ObraBDteste = await Obra.show(obraId);
        updatedObra.endereco_pdf = ObraBDteste[0].endereco_pdf;
      }

      console.log(updatedObra, "id = " + obraId);

      try {
        await Obra.update(updatedObra, obraId);
        res.status(201).json({ msg: "Obra atualizado com sucesso!" });
      } catch (error) {
        return res.status(400).json({
          erro: true,
          mensagem: "Erro ao buscar obra!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar obra!",
      });
    }
  },
  async show(req, res) {
    const obraId = req.params.id;

    if (obraId === "" || obraId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }
    try {
      const obra = await Obra.show(obraId);
      console.log(obra);

      if (obra.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum obra encontrada!",
        });
      }

      if (obra) {
        return res.status(200).json({
          erro: false,
          obra,
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar obra!",
      });
    }
  },
  async show_genero(req, res) {
    const obraGenero = req.params.id;

    if (obraGenero === "" || obraGenero == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }
    try {
      const obra = await Obra.show_cidade(obraGenero);
      console.log(obra);

      if (obra.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhuma obra encontrada!",
        });
      }

      if (obra) {
        return res.status(200).json({
          erro: false,
          obra,
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar obra!",
      });
    }
  },
};
