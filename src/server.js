// require('./db/init.js');

const express = require('express');
const server = express();
const route = require('./route');
const path = require('path');
const { resolve } = require('path');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'https://portal-do-sertao.onrender.com', 'https://front-portal-do-sertao-git-main-juniorjwjs-projects.vercel.app'], // Adicione todas as origens permitidas aqui
  optionsSuccessStatus: 200, // para navegadores antigos
};

server.use(cors(corsOptions));

server.use(cors());
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.set('views', path.join(__dirname, 'views'));
server.use(express.urlencoded({ extended: true }));
server.use(
  '/images',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads')),
);
server.use('/pdf', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
server.use(express.json());

server.use(route);

server.listen(3000, () => console.log('RODANDO'));
