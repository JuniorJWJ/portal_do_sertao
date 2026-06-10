// require('./db/init.js');

const express = require('express');
const server = express();
const route = require('./route');
const path = require('path');
const { resolve } = require('path');
const corsMiddleware = require('.././middlewares/cors.js');

// const corsOptions = {
//   origin: ['http://localhost:8080', 'https://portal-do-sertao.onrender.com', 'https://front-portal-do-sertao-git-main-juniorjwjs-projects.vercel.app'], // Adicione todas as origens permitidas aqui
//   optionsSuccessStatus: 200, // para navegadores antigos
// };

// server.use(cors(corsOptions));

server.disable('x-powered-by');
server.use(corsMiddleware);
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.set('views', path.join(__dirname, 'views'));
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(
  '/images',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads')),
);
server.use('/pdf', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
server.use(
  '/audios',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads')),
);
server.use(express.json({ limit: '1mb' }));

server.use(route);

server.listen(3000, () => console.log('RODANDO'));
