const express = require('express');
const indexController = require('./controllers/IndexController');
const autorController = require('./controllers/AutorController');
const obraController = require('./controllers/ObraController');
const generoLiterarioController = require('./controllers/GeneroLiterarioController');
const sobreController = require('./controllers/SobreController');
// const userController = require("./controllers/userController");
const cidadeController = require('./controllers/CidadeController');

const AWSV2 = require('./config/aws');

const { eAdmin } = require('../middlewares/auth');

const multer = require('multer');
const multerConfig = require('./config/multer');

const route = express.Router();
//Home
route.get('/', indexController.get);
//Sobre
route.get('/sobre', sobreController.get);
//Autor
route.get('/lista_autor', autorController.get);
route.get('/lista_autor_adm', autorController.get_all);
route.get('/lista_autor/cidade/:id', autorController.show_cidade);
route.get('/lista_autor/cidade/', autorController.show_cidade);
route.get('/autor/:id', autorController.show);
route.get('/autor/', autorController.show);
route.post(
  '/create_autor',
  multer(multerConfig).single('file'),
  autorController.create,
);
route.put(
  '/autor/update/:id',
  multer(multerConfig).single('file'),
  autorController.update,
);
route.put(
  '/autor/update/',
  multer(multerConfig).single('file'),
  autorController.update,
);
route.patch('/autor/approv/:id', autorController.approv);
route.delete('/autor/delete/:id', autorController.delete);
route.delete('/autor/delete/', autorController.delete);

route.post('/autor/log', autorController.log_user);
route.get('/profile/autor', eAdmin, autorController.profile);
//Obra
route.get('/lista_obra', obraController.get);
route.get('/lista_obra_adm', obraController.get_all);
route.get('/lista_obra/genero/:id', obraController.show_genero);
route.get('/lista_obra/genero/', obraController.show_genero);
route.get('/lista_obra/autor/:id', obraController.show_autor);
route.get('/lista_obra/autor/', obraController.show_autor);
route.get('/obra/:id', obraController.show);
route.get('/obra/', obraController.show);
route.post(
  '/create_obra',
  multer(multerConfig).fields([{ name: 'file' }, { name: 'audioFile' }]),
  obraController.create,
);
route.put(
  '/obra/update/:id',
  multer(multerConfig).single('file'),
  obraController.update,
);
route.put(
  '/obra/update/',
  multer(multerConfig).single('file'),
  obraController.update,
);

route.patch('/obra/approv/:id', obraController.approv);
route.patch('/obra/approv/', obraController.approv);
route.delete('/obra/delete/:id', obraController.delete);
route.delete('/obra/delete/', obraController.delete);
//User
// route.get("/teste", eAdmin, userController.show_users);
// route.get("/create_user", userController.create_user_get);
// route.get("/log_user", userController.log_user_get);
// route.get("/edit_list_autor", eAdmin, userController.get_editListaAutor);
// route.post("/create_user", userController.create);
// route.post("/log_user", userController.log_user);
//Cidade
route.get('/lista_cidade', cidadeController.get);
route.get('/cidade/:id', cidadeController.show);
//Gênero Literário
route.get('/lista_generos_literarios', generoLiterarioController.get);
route.get('/genero_literario/:id', generoLiterarioController.show);

module.exports = route;
