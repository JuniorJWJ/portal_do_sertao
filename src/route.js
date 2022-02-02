const express = require('express');
const indexController = require('./controllers/IndexController');
const autorController = require('./controllers/autorController');
const obraController = require('./controllers/ObraController');
const generoLiterarioController = require('./controllers/generoLiterarioController');
const sobreController = require('./controllers/sobreController');
const userController = require('./controllers/userController');


const { eAdmin } = require('../middlewares/auth');

const multer = require("multer");
const multerConfig = require("./config/multer")

const route = express.Router()
//home
route.get('/', indexController.get)
//sobread
route.get('/sobre', sobreController.get)
//autor
route.get('/lista_autor', autorController.get)
route.get('/create_autor', autorController.create_autor_get)
route.post('/create_autor',multer(multerConfig).single("file"), autorController.create)
route.post('/autor/delete/:id', autorController.delete)
route.post('/autor/edit/:id', autorController.show_edit)
route.get('/autor/:id', autorController.show)
route.post('/autor/update/:id',multer(multerConfig).single("file"), autorController.update)
//obra
route.get('/lista_obra', obraController.get)
route.get('/create_obra', obraController.create_obra_get)
route.get('/lista_obra/genero/:id', obraController.show_genero)
route.post('/create_obra',multer(multerConfig).single("file"), obraController.create)
route.post('/obra/delete/:id', obraController.delete)
route.post('/obra/edit/:id', obraController.show_edit)
route.get('/obra/:id', obraController.show)
route.post('/obra/update/:id',multer(multerConfig).single("file"), obraController.update)
//user
route.post('/create_user', userController.create)
route.post('/log_user', userController.log_user)
route.get('/teste', eAdmin, userController.show_users)
route.get('/create_user', userController.create_user_get)
route.get('/log_user', userController.log_user_get)

module.exports = route;