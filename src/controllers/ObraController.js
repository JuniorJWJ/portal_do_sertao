const Obra = require('../model/Obra');
const Autor = require('../model/Autor');
const GeneroLiterario = require('../model/GeneroLiterario');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const aws = require('aws-sdk');

const s3 = new aws.S3();

module.exports = {
  async get(req, res) {
    const obra = await Obra.get();
    return res.json({ obra: obra });
  },
  async get_all(req, res) {
    const obra = await Obra.getAll();
    return res.json({ obra: obra });
  },
  async create(req, res) {
    // console.log(req.files); // Log correto para debugar os arquivos

    let pdfUrl = '';
    let audioUrl = '';

    // Verificação de arquivos
    if (req.files) {
      // Se estiver usando S3
      // console.log("req.files:", req.files);
      if (req.files.file && req.files.file.length > 0) {
        if (process.env.STORAGE_TYPE === 's3') {
          pdfUrl = req.files.file[0].location; // URL gerada pelo S3
        } else {
          pdfUrl = req.files.file[0].path; // Caminho do arquivo local
        }
      }

      if (req.files.audioFile && req.files.audioFile.length > 0) {
        if (process.env.STORAGE_TYPE === 's3') {
          audioUrl = req.files.audioFile[0].location; // URL gerada pelo S3
        } else {
          audioUrl = req.files.audioFile[0].path; // Caminho do arquivo local
        }
      }
    }

    // Verifique se os campos obrigatórios estão presentes
    if (
      !req.body.nome ||
      !req.body.select_autor ||
      !req.body.select_genero_literario ||
      !pdfUrl // O PDF é obrigatório
    ) {
      return res
        .status(400)
        .json({ msg: 'Preencha todos os dados para completar o cadastro.' });
    }
    // console.log("req.body:",req.body)
    const obra = {
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,
      endereco_pdf: pdfUrl,
      endereco_video: req.body.endereco_video,
      endereco_audio: audioUrl || null, // Audio é opcional
    };
    // console.log("obra:", obra)

    try {
      // Cria a obra no banco de dados
      await Obra.create(obra);
      res.status(201).json({ msg: 'Obra registrada com sucesso!', obra });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao registrar a obra no sistema!' });
    }
  },
  async delete(req, res) {
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

      if (obra.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhum obra encontrado!',
        });
      }

      await Obra.delete(obraId);
      res.status(200).json({ msg: 'Obra deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ msg: 'Falha ao deletar o obra' });
    }
  },
  async update(req, res) {
    const obraId = req.params.id;
    let pdfUrl = '';
    let audioUrl = '';

    if (req.file) {
      if (process.env.STORAGE_TYPE === 's3') {
        pdfUrl = req.file.location; // URL do PDF no S3
      } else {
        pdfUrl = `${process.env.APP_API_URL}/pdf/${req.file.filename}`;
      }
    }

    if (req.audioFile) {
      if (process.env.STORAGE_TYPE === 's3') {
        audioUrl = req.audioFile.location; // URL do áudio no S3
      } else {
        audioUrl = `${process.env.APP_API_URL}/audio/${req.audioFile.filename}`;
      }
    }

    var updatedObra = {
      nome: req.body.nome,
      id_autor: req.body.select_autor,
      id_genero_literario: req.body.select_genero_literario,
      endereco_pdf: pdfUrl || '', // Usa o valor de pdfUrl se houver, ou mantém string vazia
      endereco_audio: audioUrl || '', // Usa o valor de audioUrl se houver, ou mantém string vazia
      endereco_video: req.body.endereco_video,
    };

    console.log('updatedObra: ', updatedObra);

    if (!obraId) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    try {
      const obra = await Obra.show(obraId);
      console.log('meio:', obra);

      if (obra.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada!',
        });
      }

      if (!updatedObra.endereco_pdf) {
        updatedObra.endereco_pdf = obra[0].endereco_pdf; // Preserva o PDF original se não houver novo
      }

      if (!updatedObra.endereco_audio) {
        updatedObra.endereco_audio = obra[0].endereco_audio; // Preserva o áudio original se não houver novo
      }

      try {
        await Obra.update(updatedObra, obraId);
        res.status(201).json({ msg: 'Obra atualizada com sucesso!' });
      } catch (error) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Erro ao atualizar a obra!',
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar obra!',
      });
    }
  },
  async approv(req, res) {
    const obraId = req.params.id;

    if (obraId === '' || obraId == undefined) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Insira um ID correto!',
      });
    }

    try {
      const obra = await Obra.show(obraId);

      if (obra.length === 0) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Nenhuma obra encontrada!',
        });
      }

      try {
        await Obra.approv(obraId);
        res.status(201).json({ msg: 'Obra aprovada com sucesso!' });
      } catch (error) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Erro ao buscar obra!',
        });
      }
    } catch (error) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar obra!',
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
          mensagem: 'Nenhum obra encontrada!',
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
