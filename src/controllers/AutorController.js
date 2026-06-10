const Autor = require('../model/Autor');
const Cidade = require('../model/Cidade');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appApiUrl = (process.env.APP_API_URL || '').replace(/\/$/, '');

function getBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

module.exports = {
  async get(req, res) {
    const autor = await Autor.get();
    const cidade = await Cidade.get();
    return res.json({ autor: autor, cidade: cidade });
  },

  async get_all(req, res) {
    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token nao fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuracao do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      if (decodedToken.adm !== 1) {
        return res.status(403).json({
          error: true,
          message: 'Acesso restrito a administradores.',
        });
      }

      const autor = await Autor.get_all();
      const cidade = await Cidade.get();
      return res.json({ autor: autor, cidade: cidade });
    } catch (error) {
      return res.status(401).json({
        error: true,
        message: 'Token invalido!',
      });
    }
  },

  async create(req, res) {
    if (
      !req.body.nome ||
      !req.body.profissao ||
      !req.body.biografia ||
      !req.body.email ||
      !req.body.id_cidade ||
      !req.body.genero ||
      !req.body.cor_de_pele ||
      !req.body.password ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ msg: 'Preencha todos os dados para completar o cadastro' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    let fotoUrl = '';
    if (req.file) {
      if (process.env.STORAGE_TYPE === 's3') {
        fotoUrl = req.file.location;
      } else {
        fotoUrl = `${appApiUrl}/images/${req.file.filename}`;
      }
    }

    const autor = {
      nome: req.body.nome,
      profissao: req.body.profissao,
      biografia: req.body.biografia,
      email: req.body.email,
      id_cidade: req.body.id_cidade,
      genero: req.body.genero,
      cor_de_pele: req.body.cor_de_pele,
      password: hashedPassword,
      endereco_foto: fotoUrl,
    };

    const existAutor = await Autor.show_email(autor.email);
    if (existAutor.length > 0) {
      return res.status(409).json({
        erro: true,
        mensagem: 'Ja existe um autor com esse email!',
      });
    }

    try {
      await Autor.create(autor);
      res.status(201).json({ msg: 'Autor registrado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao registrar o autor no sistema!' });
    }
  },
  async delete(req, res) {
    const autorId = req.params.id;

    if (!autorId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token nao fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuracao do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;

      const autorToDelete = await Autor.show(autorId);
      const authenticatedAutor = await Autor.show(authenticatedAutorId);

      if (autorToDelete.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Nenhum autor encontrado para deletar!',
        });
      }

      if (authenticatedAutor.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Nenhum autor autenticado encontrado!',
        });
      }

      if (authenticatedAutor[0].adm === 1) {
        await Autor.delete(autorId);
        return res.status(200).json({ msg: 'Autor deletado com sucesso' });
      }

      return res.status(403).json({
        error: true,
        message: 'Voce nao tem permissao para deletar esse autor.',
      });
    } catch (error) {
      console.error('Erro ao processar a solicitacao:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token invalido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res
        .status(500)
        .json({ msg: 'Falha ao processar a solicitacao' });
    }
  },

  async update(req, res) {
    const autorId = req.params.id;

    if (!autorId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token nao fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuracao do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;

      const [authenticatedAutor] = await Autor.show(authenticatedAutorId);
      const [autorToUpdate] = await Autor.show(autorId);

      if (!autorToUpdate) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor a ser atualizado nao encontrado!',
        });
      }

      if (!authenticatedAutor) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor autenticado nao encontrado!',
        });
      }

      if (
        authenticatedAutor.id !== autorToUpdate.id &&
        authenticatedAutor.adm !== 1
      ) {
        return res.status(403).json({
          error: true,
          message: 'Voce nao tem permissao para atualizar este autor.',
        });
      }

      let fotoUrl = '';
      if (req.file) {
        fotoUrl =
          process.env.STORAGE_TYPE === 's3'
            ? req.file.location
            : `${appApiUrl}/images/${req.file.filename}`;
      }

      const updatedAutor = {
        nome: req.body.nome || autorToUpdate.nome,
        profissao: req.body.profissao || autorToUpdate.profissao,
        biografia: req.body.biografia || autorToUpdate.biografia,
        email: req.body.email || autorToUpdate.email,
        id_cidade: req.body.id_cidade || autorToUpdate.id_cidade,
        genero: req.body.genero || autorToUpdate.genero,
        cor_de_pele: req.body.cor_de_pele || autorToUpdate.cor_de_pele,
        endereco_foto: req.file ? fotoUrl : autorToUpdate.endereco_foto,
      };

      await Autor.update(updatedAutor, autorId);
      return res.status(200).json({ msg: 'Autor atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro no processo de atualizacao:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token invalido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor ao processar a atualizacao',
      });
    }
  },
  async approv(req, res) {
    const autorId = req.params.id;

    if (!autorId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token nao fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuracao do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;

      const [authenticatedAutor] = await Autor.show(authenticatedAutorId);
      const [autorToApprov] = await Autor.show(autorId);

      if (!autorToApprov) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Nenhum autor encontrado para aprovacao!',
        });
      }

      if (!authenticatedAutor) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor autenticado nao encontrado!',
        });
      }

      if (authenticatedAutor.adm !== 1) {
        return res.status(403).json({
          error: true,
          message: 'Apenas administradores podem aprovar autores!',
        });
      }

      await Autor.approv(autorId);
      return res.status(200).json({ msg: 'Autor aprovado com sucesso!' });
    } catch (error) {
      console.error('Erro no processo de aprovacao:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token invalido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor ao processar a aprovacao',
      });
    }
  },
  async show(req, res) {
    const autorID = req.params.id;
    if (autorID === '' || autorID == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }
    try {
      const autor = await Autor.show(autorID);
      // console.log(autor);

      if (autor.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhum autor encontrado!',
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
        mensagem: 'Erro ao buscar autor!',
      });
    }
  },
  async show_cidade(req, res) {
    const autorCidade = req.params.id;
    if (autorCidade === '' || autorCidade == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }
    try {
      const autor = await Autor.show_cidade(autorCidade);
      // console.log(autor);

      if (autor.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhum autor encontrado!',
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
        mensagem: 'Erro ao buscar autor!',
      });
    }
  },
  async log_user(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: 'Preencha todos os campos!' });
    }

    try {
      const user = await Autor.show_email(email);
      if (!user || user.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Erro: Usuario ou senha incorreta!',
        });
      }

      if (user[0].aprovado == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Erro: Esse usuario ainda nao foi aprovado.',
        });
      }

      if (!(await bcrypt.compare(password, user[0].password))) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Erro: Usuario ou senha incorreta!',
        });
      }

      const jwtSecret = process.env.TOKEN_JWT;
      if (!jwtSecret) {
        return res.status(500).json({
          erro: true,
          mensagem: 'Erro de configuracao do servidor.',
        });
      }

      const token = jwt.sign(
        { id: user[0].id, adm: user[0].adm },
        jwtSecret,
        { expiresIn: '30m' },
      );

      return res.json({
        erro: false,
        mensagem: 'Login realizado com sucesso!',
        token,
        id: user[0].id,
        adm: user[0].adm,
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao processar login!',
      });
    }
  },
  async profile(req, res) {
    const autorId = req.userId;

    if (!autorId) {
      return res
        .status(401)
        .json({ erro: true, mensagem: 'Token nao fornecido!' });
    }

    try {
      const autor = await Autor.show(autorId);

      if (autor.length === 0) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Nenhum autor encontrado!',
        });
      }

      return res.status(200).json({
        erro: false,
        autor: autor[0],
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao buscar autor!',
      });
    }
  },
};








