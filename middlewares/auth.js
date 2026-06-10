const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: true,
        mensagem:
          'Erro: Necessário realizar o login para acessar a página! Token ausente.',
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        erro: true,
        mensagem:
          'Erro: Necessário informar o token no formato "Bearer <token>".',
      });
    }

    const jwtSecret = process.env.TOKEN_JWT;
    if (!jwtSecret) {
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro de configuração do servidor.',
      });
    }

    try {
      const decode = await promisify(jwt.verify)(token, jwtSecret);
      req.userId = decode.id;
      req.user = decode;
      return next();
    } catch (err) {
      return res.status(401).json({
        erro: true,
        mensagem:
          'Erro: Necessário realizar o login para acessar a página! Token inválido.',
      });
    }
  },
};
