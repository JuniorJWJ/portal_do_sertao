const Obra = require('../model/Obra');
const Autor = require('../model/Autor');
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
    const obra = await Obra.get();
    return res.json({ obra: obra });
  },
  async get_all(req, res) {
    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token não fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuração do servidor.',
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

      const obra = await Obra.getAll();
      return res.json({ obra: obra });
    } catch (error) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido!',
      });
    }
  },
  async create(req, res) {
    let pdfUrl = '';
    let audioUrl = '';

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token não fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuração do servidor.',
      });
    }

    let idAutor = '';

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;
      const autor = await Autor.show(authenticatedAutorId);

      if (!autor || autor.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Nenhum autor encontrado!',
        });
      }

      idAutor = autor[0].id;
    } catch (error) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido!',
      });
    }

    if (req.files) {
      if (req.files.file && req.files.file.length > 0) {
        if (process.env.STORAGE_TYPE === 's3') {
          pdfUrl = req.files.file[0].location;
        } else {
          pdfUrl = `${appApiUrl}/pdf/${req.files.file[0].filename}`;
        }
      }

      if (req.files.audioFile && req.files.audioFile.length > 0) {
        if (process.env.STORAGE_TYPE === 's3') {
          audioUrl = req.files.audioFile[0].location;
        } else {
          audioUrl = `${appApiUrl}/audios/${req.files.audioFile[0].filename}`;
        }
      }
    }

    if (!req.body.nome || !req.body.select_genero_literario || !pdfUrl) {
      return res
        .status(400)
        .json({ msg: 'Preencha todos os dados para completar o cadastro.' });
    }

    const obra = {
      nome: req.body.nome,
      id_autor: idAutor,
      id_genero_literario: req.body.select_genero_literario,
      endereco_pdf: pdfUrl,
      endereco_video: req.body.endereco_video || null,
      endereco_audio: audioUrl || null,
    };

    try {
      await Obra.create(obra);
      res.status(201).json({ msg: 'Obra registrada com sucesso!', obra });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao registrar a obra no sistema!' });
    }
  },
  async delete(req, res) {
    const obraId = req.params.id;
    if (!obraId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token não fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuração do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;
      const [authenticatedAutor] = await Autor.show(authenticatedAutorId);
      const [obraToDelete] = await Obra.show(obraId);

      if (!obraToDelete) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Obra não encontrada!',
        });
      }

      if (!authenticatedAutor) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor autenticado não encontrado!',
        });
      }

      if (
        authenticatedAutor.id === obraToDelete.id_autor ||
        authenticatedAutor.adm === 1
      ) {
        await Obra.delete(obraId);
        return res.status(200).json({ msg: 'Obra excluída com sucesso!' });
      }

      return res.status(403).json({
        error: true,
        message: 'Você não tem permissão para excluir esta obra!',
      });
    } catch (error) {
      console.error('Erro no processo de exclusao:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token inválido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor ao processar a exclusao',
      });
    }
  },
  async update(req, res) {
    const obraId = req.params.id;

    if (!obraId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token não fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuração do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;

      const [authenticatedAutor] = await Autor.show(authenticatedAutorId);
      const [obraToUpdate] = await Obra.show(obraId);

      if (!obraToUpdate) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Obra a ser atualizada não encontrada!',
        });
      }

      if (!authenticatedAutor) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor autenticado não encontrado!',
        });
      }

      if (
        authenticatedAutor.id !== obraToUpdate.id_autor &&
        authenticatedAutor.adm !== 1
      ) {
        return res.status(403).json({
          error: true,
          message: 'Você não tem permissão para atualizar esta obra.',
        });
      }

      let pdfUrl = obraToUpdate.endereco_pdf;
      let audioUrl = obraToUpdate.endereco_audio;

      if (req.files) {
        if (req.files.file && req.files.file.length > 0) {
          pdfUrl =
            process.env.STORAGE_TYPE === 's3'
              ? req.files.file[0].location
              : `${appApiUrl}/pdf/${req.files.file[0].filename}`;
        }

        if (req.files.audioFile && req.files.audioFile.length > 0) {
          audioUrl =
            process.env.STORAGE_TYPE === 's3'
              ? req.files.audioFile[0].location
              : `${appApiUrl}/audios/${req.files.audioFile[0].filename}`;
        }
      }

      const updatedObra = {
        nome: req.body.nome || obraToUpdate.nome,
        id_autor:
          authenticatedAutor.adm === 1 && req.body.select_autor
            ? req.body.select_autor
            : obraToUpdate.id_autor,
        id_genero_literario:
          req.body.select_genero_literario || obraToUpdate.id_genero_literario,
        endereco_pdf: pdfUrl,
        endereco_audio: audioUrl,
        endereco_video: req.body.endereco_video || obraToUpdate.endereco_video,
      };

      await Obra.update(updatedObra, obraId);
      return res.status(200).json({ msg: 'Obra atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro no processo de atualização:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token inválido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor ao processar a atualização',
      });
    }
  },
  async approv(req, res) {
    const obraId = req.params.id;

    if (!obraId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: 'Token não fornecido!' });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        error: true,
        message: 'Erro de configuração do servidor.',
      });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      const authenticatedAutorId = decodedToken.id;

      const [authenticatedAutor] = await Autor.show(authenticatedAutorId);

      if (!authenticatedAutor) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Autor autenticado não encontrado!',
        });
      }

      if (authenticatedAutor.adm !== 1) {
        return res.status(403).json({
          error: true,
          message: 'Apenas administradores podem aprovar obras!',
        });
      }

      const [obra] = await Obra.show(obraId);
      if (!obra) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada para aprovação!',
        });
      }

      await Obra.approv(obraId);
      return res.status(200).json({ msg: 'Obra aprovada com sucesso!' });
    } catch (error) {
      console.error('Erro no processo de aprovação:', error);

      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token inválido!' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ error: true, message: 'Token expirado!' });
      }

      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor ao processar a aprovação',
      });
    }
  },
  async show(req, res) {
    const obraId = req.params.id;

    if (obraId === '' || obraId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }
    try {
      const obra = await Obra.show(obraId);
      // console.log(obra);

      if (obra.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada!',
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
        mensagem: 'Erro ao buscar obra!',
      });
    }
  },
  async show_genero(req, res) {
    const obraGenero = req.params.id;

    if (obraGenero === '' || obraGenero == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }
    try {
      const obra = await Obra.show_genero(obraGenero);
      // console.log(obra);

      if (obra.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada!',
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
        mensagem: 'Erro ao buscar obra!',
      });
    }
  },
  async show_autor(req, res) {
    const obraAutor = req.params.id;
    // console.log(obraAutor);
    if (obraAutor === '' || obraAutor == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }
    try {
      const obra = await Obra.show_autor(obraAutor);
      // console.log(obra);

      if (obra.length == 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada!',
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
        mensagem: 'Erro ao buscar obra!',
      });
    }
  },
};

//obra backup




