const express = require('express');
const autorController = require('./controllers/autorController');

const route = express.Router()

route.get('/', autorController.get)
route.post('/create_number', autorController.create)
route.post('/autor/delete/:id', autorController.delete)
route.post('/autor/edit/:id', autorController.show)
route.post('/autor/update/:id', autorController.update)


module.exports = route;