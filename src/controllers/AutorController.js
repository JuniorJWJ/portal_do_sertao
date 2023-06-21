const Autor = require("../model/Autor");
const Cidade = require("../model/cidade");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async get(req, res) {
    const autor = await Autor.get();
    const cidade = await Cidade.get();
    return res.json({ autor: autor, cidade: cidade });
  },
  async create(req, res) {
    if (
      req.body.nome == "" ||
      req.body.profissao == "" ||
      req.body.biografia == "" ||
      req.body.email == "" ||
      req.body.id_cidade == "" ||
      req.body.genero == "" ||
      req.body.password == "" ||
      req.file == ""
    ) {
      return res
        .status(500)
        .json({ msg: "Preencha todos os dados para completar o cadastro" });
    }
    const autor = {
      nome: req.body.nome,
      profissao: req.body.profissao,
      biografia: req.body.biografia,
      email: req.body.email,
      id_cidade: req.body.id_cidade,
      genero: req.body.genero,
      password: await bcrypt.hash(req.body.password, 8),
      endereco_foto: req.file
        ? `http://localhost:3000/images/${req.file.filename}`
        : "",
    };
    const existAutor = await Autor.show_email(autor.email);

    if (existAutor) {
      return res.status(200).json({
        erro: false,
        mensagem: "Já existe um autor com esse email!",
      });
    }

    try {
      await Autor.create(autor);
      res.status(201).json({ msg: "Autor registrado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao registrar o autor no sistema!" });
    }
  },
  async delete(req, res) {
    const autorId = req.params.id;

    if (autorId === "" || autorId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }

    try {
      const autor = await Autor.show(autorId);
      // console.log(autor);

      if (autor.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum autor encontrado!",
        });
      }

      await Autor.delete(autorId);
      res.status(200).json({ msg: "Autor deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: "Falha ao deletar o autor" });
    }
  },
  async update(req, res) {
    const autorId = req.params.id;
    // console.log(autorId);

    const updatedAutor = {
      nome: req.body.nome,
      profissao: req.body.profissao,
      biografia: req.body.biografia,
      email: req.body.email,
      id_cidade: req.body.id_cidade,
      genero: req.body.genero,
      endereco_foto: req.file
        ? `http://localhost:3000/images/${req.file.filename}`
        : "",
    };

    if (autorId === "" || autorId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }

    try {
      const autor = await Autor.show(autorId);
      // console.log(autor);

      if (autor.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum autor encontrado!",
        });
      }

      if (!updatedAutor.endereco_foto) {
        const AutorBDteste = await Autor.show(autorId);
        updatedAutor.endereco_foto = AutorBDteste[0].endereco_foto;
      }

      // console.log(updatedAutor, "id = " + autorId);

      try {
        await Autor.update(updatedAutor, autorId);
        res.status(201).json({ msg: "Autor atualizado com sucesso!" });
      } catch (error) {
        return res.status(400).json({
          erro: true,
          mensagem: "Erro ao buscar autor!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar autor!",
      });
    }
  },
  async show(req, res) {
    const autorID = req.params.id;
    if (autorID === "" || autorID == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }
    try {
      const autor = await Autor.show(autorID);
      // console.log(autor);

      if (autor.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum autor encontrado!",
        });
      }

      if (autor) {
        return res.status(200).json({
          erro: false,
          autor,
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar autor!",
      });
    }
  },
  async show_cidade(req, res) {
    const autorCidade = req.params.id;
    if (autorCidade === "" || autorCidade == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: "Insira um ID correto!",
      });
    }
    try {
      const autor = await Autor.show_cidade(autorCidade);
      // console.log(autor);

      if (autor.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: "Nenhum autor encontrado!",
        });
      }

      if (autor) {
        return res.status(200).json({
          erro: false,
          autor,
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro ao buscar autor!",
      });
    }
  },
  async log_user(req, res) {
    if (!req.body.email) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Insira um Email válido!",
      });
    }
    const userEmail = req.body.email;
    const user = await Autor.show_email(userEmail);
    // console.log(req.body);
    // console.log(user);
    if (user == null || user.length === 0) {
      // console.log("entrou");
      return res.status(400).json({
        erro: true,
        mensagem:
          "Erro: Usuário ou a senha incorreta! Nenhum usuário com este e-mail",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user[0].password))) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!",
      });
    }
    var token = jwt.sign({ id: user.id }, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
      expiresIn: "30m", // 7 dia
    });
    return res.json({
      erro: false,
      mensagem: "Login realizado com sucesso!",
      token,
      id: user[0].id,
      adm: user[0].adm,
    });
  },
};
