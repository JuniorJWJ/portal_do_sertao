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

const port = Number(process.env.PORT || 3000);

const listener = server.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});

listener.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `A porta ${port} ja esta em uso. Feche o processo antigo ou defina outra porta com PORT=3001.`,
    );
    process.exit(1);
  }

  throw error;
});
