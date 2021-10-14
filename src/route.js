const express = require('express');
const autorController = require('./controllers/autorController');
const uploadController = require('./controllers/uploadController');

const multer = require("multer");
const multerConfig = require("./config/multer")

const route = express.Router()

route.get('/', autorController.get)
route.post('/create_autor',multer(multerConfig).single("file"), autorController.create)
route.post('/autor/delete/:id', autorController.delete)
route.post('/autor/edit/:id', autorController.show)
route.post('/autor/update/:id',multer(multerConfig).single("file"), autorController.update)
route.get("/formupload", uploadController.get)
route.post("/posts", multer(multerConfig).single("file"), (req, res) => {
    console.log(req.file.filename)

    return res.json({ hello:"Davy"})
})


module.exports = route;