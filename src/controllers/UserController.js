const User = require('../model/user')
const { eAdmin } = require('../../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async create(req, res) {
    await User.create({
      nome: req.body.nome,
      password: await bcrypt.hash( req.body.password, 8), 
      email: req.body.email,
    })
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "User cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: User não cadastrado com sucesso!"
        });
    });    
    //return res.redirect('/lista_autor')
  },
  async log_user(req, res) {
    const userEmail = req.body.email
    const user = await User.show(userEmail)
    console.log(req.body)
    console.log(user)
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Nenhum usuário com este e-mail"
        });
    }
    if(!(await bcrypt.compare(req.body.password, user[0].password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!"
        });
    }
    var token = jwt.sign({id: user.id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        //expiresIn: 600 //10 min
        //expiresIn: 60 //1 min
        expiresIn: '7d' // 7 dia
    });
    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
  },
  async show_users(req, res){
    
    await User.get().then((users) => {
        return res.json({
            erro: false,
            users,
            id_usuario_logado: req.userId
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    });    
  },
  async create_user_get(req,res){ 

    return res.render("createUser")
  },
  async log_user_get(req,res){ 

    return res.render("logUser")
  },
}