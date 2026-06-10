const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('./config');

const appApiUrl = (process.env.APP_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
const uploadsDir = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

const cidades = [
  [1, 'Agua Fria'],
  [2, 'Amelia Rodrigues'],
  [3, 'Anguera'],
  [4, 'Antonio Cardoso'],
  [5, 'Conceicao da Feira'],
  [6, 'Conceicao do Jacuipe'],
  [7, 'Coracao de Maria'],
  [8, 'Feira de Santana'],
  [9, 'Ipecaeta'],
  [10, 'Irara'],
  [11, 'Santa Barbara'],
  [12, 'Santanopolis'],
  [13, 'Santo Estevao'],
  [14, 'Sao Goncalo dos Campos'],
  [15, 'Tanquinho'],
  [16, 'Teodoro Sampaio'],
  [17, 'Terra Nova'],
];

const generosLiterarios = [
  [1, 'Ficcao Literaria'],
  [2, 'Novela'],
  [3, 'Suspense'],
  [4, 'Ficcao Cientifica'],
  [5, 'Fantasia'],
  [6, 'Terror'],
  [7, 'Teatro'],
  [8, 'Romance'],
  [9, 'Infanto Juvenil'],
  [10, 'Texto Litero Musical'],
  [11, 'Poema'],
  [12, 'Ensaio'],
  [13, 'Cronica Argumentativa'],
  [14, 'Cordel'],
  [15, 'Contos'],
  [16, 'Cronica Literaria'],
];

const autores = [
  {
    nome: 'Admin Portal',
    profissao: 'Administrador',
    biografia: 'Conta administrativa para testar aprovacoes e cadastros.',
    email: 'admin@portal.local',
    genero: 'Prefiro nao informar',
    cor_de_pele: 'Parda',
    id_cidade: 8,
    adm: 1,
    avatar: {
      file: 'seed-admin-portal.svg',
      initials: 'AP',
      bg: '#2f4858',
      fg: '#f7f3ea',
    },
  },
  {
    nome: 'Maria do Sertao',
    profissao: 'Poeta',
    biografia:
      'Autora de poemas sobre memoria, feira livre e caminhos do interior.',
    email: 'maria@portal.local',
    genero: 'Feminino',
    cor_de_pele: 'Parda',
    id_cidade: 8,
    adm: 0,
    avatar: {
      file: 'seed-maria-do-sertao.svg',
      initials: 'MS',
      bg: '#8f4d2e',
      fg: '#fff7ef',
    },
  },
  {
    nome: 'Joao Cordelista',
    profissao: 'Cordelista',
    biografia:
      'Escritor popular dedicado a narrativas de humor, politica e cotidiano.',
    email: 'joao@portal.local',
    genero: 'Masculino',
    cor_de_pele: 'Preta',
    id_cidade: 10,
    adm: 0,
    avatar: {
      file: 'seed-joao-cordelista.svg',
      initials: 'JC',
      bg: '#275d48',
      fg: '#f4fbf5',
    },
  },
  {
    nome: 'Ana Feira',
    profissao: 'Professora',
    biografia:
      'Pesquisadora de literatura regional e cronicas de cidade pequena.',
    email: 'ana@portal.local',
    genero: 'Feminino',
    cor_de_pele: 'Branca',
    id_cidade: 13,
    adm: 0,
    avatar: {
      file: 'seed-ana-feira.svg',
      initials: 'AF',
      bg: '#6b4f8a',
      fg: '#fbf7ff',
    },
  },
  {
    nome: 'Carlos de Irara',
    profissao: 'Compositor',
    biografia:
      'Autor de textos litero-musicais inspirados por cantigas e relatos orais.',
    email: 'carlos@portal.local',
    genero: 'Masculino',
    cor_de_pele: 'Parda',
    id_cidade: 10,
    adm: 0,
    avatar: {
      file: 'seed-carlos-de-irara.svg',
      initials: 'CI',
      bg: '#7a5b20',
      fg: '#fff8df',
    },
  },
];

const obras = [
  {
    nome: 'Caminhos de Feira',
    autorEmail: 'maria@portal.local',
    generoId: 11,
    resumo: 'Poemas curtos sobre memoria, feira livre e deslocamentos.',
    enderecoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    nome: 'A Feira Antes do Sol',
    autorEmail: 'maria@portal.local',
    generoId: 16,
    resumo: 'Cronicas sobre trabalhadores que chegam antes da cidade acordar.',
    enderecoVideo: '',
  },
  {
    nome: 'O Romance do Licuri',
    autorEmail: 'joao@portal.local',
    generoId: 14,
    resumo: 'Cordel bem-humorado sobre uma disputa por um pe de licuri.',
    enderecoVideo: '',
  },
  {
    nome: 'Sete Versos Para Irara',
    autorEmail: 'joao@portal.local',
    generoId: 14,
    resumo: 'Sete narrativas populares ambientadas nas ruas de Irara.',
    enderecoVideo: '',
  },
  {
    nome: 'Cronicas da Estrada',
    autorEmail: 'ana@portal.local',
    generoId: 16,
    resumo: 'Relatos de viagens entre escolas, povoados e bibliotecas.',
    enderecoVideo: '',
  },
  {
    nome: 'Noite em Santo Estevao',
    autorEmail: 'ana@portal.local',
    generoId: 3,
    resumo: 'Suspense regional sobre uma carta esquecida em uma rodoviaria.',
    enderecoVideo: '',
  },
  {
    nome: 'Cantiga Para o Sertao',
    autorEmail: 'carlos@portal.local',
    generoId: 10,
    resumo: 'Texto litero-musical para voz, viola e coro comunitario.',
    enderecoVideo: '',
  },
  {
    nome: 'O Menino e a Sanfona',
    autorEmail: 'carlos@portal.local',
    generoId: 9,
    resumo: 'Narrativa infanto juvenil sobre musica, familia e descoberta.',
    enderecoVideo: '',
  },
];

function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createAvatar(autor) {
  const filePath = path.join(uploadsDir, autor.avatar.file);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="${escapeXml(
    autor.nome,
  )}">
  <rect width="320" height="320" rx="42" fill="${autor.avatar.bg}"/>
  <circle cx="234" cy="78" r="44" fill="rgba(255,255,255,0.18)"/>
  <circle cx="76" cy="242" r="58" fill="rgba(255,255,255,0.12)"/>
  <text x="160" y="178" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="700" fill="${autor.avatar.fg}">${autor.avatar.initials}</text>
  <text x="160" y="226" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="${autor.avatar.fg}">${escapeXml(
    autor.profissao,
  )}</text>
</svg>
`;

  fs.writeFileSync(filePath, svg);
  return `${appApiUrl}/images/${autor.avatar.file}`;
}

function createGenericAvatar() {
  const fileName = 'seed-autor-generico.svg';
  const filePath = path.join(uploadsDir, fileName);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="Autor">
  <rect width="320" height="320" rx="42" fill="#4b5563"/>
  <circle cx="160" cy="122" r="54" fill="#f9fafb"/>
  <path d="M72 276c16-58 54-88 88-88s72 30 88 88" fill="#f9fafb"/>
  <text x="160" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#f9fafb">Portal do Sertao</text>
</svg>
`;

  fs.writeFileSync(filePath, svg);
  return `${appApiUrl}/images/${fileName}`;
}

function createPdf(obra, autor) {
  const fileName = `seed-${slugify(obra.nome)}.pdf`;
  const filePath = path.join(uploadsDir, fileName);
  const title = obra.nome.replace(/[()\\]/g, '');
  const author = autor.nome.replace(/[()\\]/g, '');
  const resumo = obra.resumo.replace(/[()\\]/g, '');
  const content = `BT
/F1 20 Tf
72 750 Td
(${title}) Tj
0 -34 Td
/F1 13 Tf
(Autor: ${author}) Tj
0 -28 Td
(${resumo}) Tj
0 -40 Td
(Arquivo gerado pelo seed local do Portal do Sertao.) Tj
ET`;
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  fs.writeFileSync(filePath, pdf);
  return `${appApiUrl}/pdf/${fileName}`;
}

function createGenericPdf() {
  return createPdf(
    {
      nome: 'Obra de Teste',
      resumo: 'Arquivo generico para registros locais sem PDF valido.',
    },
    { nome: 'Portal do Sertao' },
  );
}

async function upsertLookup(client, table, rows) {
  for (const [id, nome] of rows) {
    await client.query(
      `
        INSERT INTO ${table} (id, nome)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome
      `,
      [id, nome],
    );
  }

  await client.query(
    `
      SELECT setval(
        pg_get_serial_sequence($1, 'id'),
        GREATEST((SELECT MAX(id) FROM ${table}), 1),
        true
      )
    `,
    [table],
  );
}

async function upsertAutor(client, autor, hashedPassword) {
  const enderecoFoto = createAvatar(autor);

  const existing = await client.query('SELECT id FROM autor WHERE email = $1', [
    autor.email,
  ]);

  if (existing.rowCount > 0) {
    const [{ id }] = existing.rows;
    await client.query(
      `
        UPDATE autor SET
          nome = $1,
          profissao = $2,
          biografia = $3,
          endereco_foto = $4,
          genero = $5,
          cor_de_pele = $6,
          id_cidade = $7,
          password = $8,
          adm = $9,
          aprovado = 1
        WHERE id = $10
      `,
      [
        autor.nome,
        autor.profissao,
        autor.biografia,
        enderecoFoto,
        autor.genero,
        autor.cor_de_pele,
        autor.id_cidade,
        hashedPassword,
        autor.adm,
        id,
      ],
    );
    return id;
  }

  const inserted = await client.query(
    `
      INSERT INTO autor (
        nome,
        profissao,
        biografia,
        email,
        endereco_foto,
        genero,
        cor_de_pele,
        id_cidade,
        password,
        adm,
        aprovado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1)
      RETURNING id
    `,
    [
      autor.nome,
      autor.profissao,
      autor.biografia,
      autor.email,
      enderecoFoto,
      autor.genero,
      autor.cor_de_pele,
      autor.id_cidade,
      hashedPassword,
      autor.adm,
    ],
  );

  return inserted.rows[0].id;
}

async function upsertObra(client, obra, autor) {
  const enderecoPdf = createPdf(obra, autor);

  const existing = await client.query(
    'SELECT id FROM obra WHERE nome = $1 AND id_autor = $2',
    [obra.nome, autor.id],
  );

  if (existing.rowCount > 0) {
    await client.query(
      `
        UPDATE obra SET
          id_genero_literario = $1,
          endereco_video = $2,
          endereco_pdf = $3,
          endereco_audio = $4,
          aprovado = 1
        WHERE id = $5
      `,
      [
        obra.generoId,
        obra.enderecoVideo,
        enderecoPdf,
        '',
        existing.rows[0].id,
      ],
    );
    return;
  }

  await client.query(
    `
      INSERT INTO obra (
        nome,
        id_autor,
        id_genero_literario,
        endereco_video,
        endereco_pdf,
        endereco_audio,
        aprovado
      )
      VALUES ($1, $2, $3, $4, $5, $6, 1)
    `,
    [obra.nome, autor.id, obra.generoId, obra.enderecoVideo, enderecoPdf, ''],
  );
}

async function normalizeBrokenAuthorImages(client) {
  const genericAvatar = createGenericAvatar();

  await client.query(
    `
      UPDATE autor
      SET endereco_foto = $1
      WHERE endereco_foto IS NULL
         OR endereco_foto = ''
         OR endereco_foto LIKE '%fakercloud.com%'
         OR endereco_foto LIKE '%loremflickr.com%'
         OR endereco_foto LIKE '%placeimg.com%'
    `,
    [genericAvatar],
  );
}

async function normalizeBrokenObraFiles(client) {
  const genericPdf = createGenericPdf();
  const localPdfPrefix = `${appApiUrl}/pdf/`;

  const { rows } = await client.query('SELECT id, endereco_pdf FROM obra');

  for (const row of rows) {
    const pdf = row.endereco_pdf || '';
    let shouldNormalize = pdf.trim() === '';

    if (pdf.startsWith(localPdfPrefix)) {
      const fileName = decodeURIComponent(pdf.slice(localPdfPrefix.length));
      shouldNormalize = shouldNormalize || !fs.existsSync(path.join(uploadsDir, fileName));
    }

    if (shouldNormalize) {
      await client.query('UPDATE obra SET endereco_pdf = $1 WHERE id = $2', [
        genericPdf,
        row.id,
      ]);
    }
  }
}

async function seed() {
  const client = await db.connect();
  const password = '123456';

  try {
    ensureUploadsDir();
    await client.query('BEGIN');

    await upsertLookup(client, 'cidade', cidades);
    await upsertLookup(client, 'generoLiterario', generosLiterarios);

    const hashedPassword = await bcrypt.hash(password, 8);
    const autorIdsByEmail = new Map();

    for (const autor of autores) {
      const id = await upsertAutor(client, autor, hashedPassword);
      autorIdsByEmail.set(autor.email, { ...autor, id });
    }

    for (const obra of obras) {
      await upsertObra(client, obra, autorIdsByEmail.get(obra.autorEmail));
    }

    await normalizeBrokenAuthorImages(client);
    await normalizeBrokenObraFiles(client);

    await client.query('COMMIT');

    console.log('Seed concluido com sucesso.');
    console.log('Login admin: admin@portal.local / 123456');
    console.log('Login autor: maria@portal.local / 123456');
    console.log(`Arquivos locais gerados em: ${uploadsDir}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.end();
  }
}

seed();
