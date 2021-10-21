const express = require('express');
const autorController = require('./controllers/autorController');
const obraController = require('./controllers/ObraController');

const multer = require("multer");
const multerConfig = require("./config/multer")

const route = express.Router()

route.get('/', autorController.get)
route.post('/create_autor',multer(multerConfig).single("file"), autorController.create)
route.post('/autor/delete/:id', autorController.delete)
route.post('/autor/edit/:id', autorController.show)
route.post('/autor/update/:id',multer(multerConfig).single("file"), autorController.update)
//obra
route.get('/obra', obraController.get)
route.post('/create_obra',multer(multerConfig).single("file"), obraController.create)
route.post('/obra/delete/:id', obraController.delete)
route.post('/obra/edit/:id', obraController.show)
route.post('/obra/update/:id',multer(multerConfig).single("file"), obraController.update)

module.exports = route;