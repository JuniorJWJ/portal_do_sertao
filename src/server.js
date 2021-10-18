const express = require('express')
const server = express()
const route = require('./route')
const path = require('path')
const { resolve } = require('path')

server.set('view engine', 'ejs')
server.use(express.static("public"))
server.set('views', path.join(__dirname, 'views'))
server.use(express.urlencoded({extended: true}))
server.use('/images', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
server.use('/pdf', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));

server.use(route)

server.listen(3000, () => console.log("RODANDO"));