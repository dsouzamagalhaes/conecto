const db = require('../config/database');
const bcrypt = require('bcrypt');

// Inicializar o banco de dados
async function initializeDatabase() {
  try {
    await db.connect();
    
    // Criar tabelas
    await db.run(`CREATE TABLE IF NOT EXISTS conta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senha_hash BLOB NOT NULL,
      email TEXT NOT NULL UNIQUE,
      provider TEXT,
      provider_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Add columns if they don't exist (for existing databases)
    try {
      await db.run('ALTER TABLE conta ADD COLUMN provider TEXT');
      console.log('Coluna provider adicionada');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Coluna provider já existe');
    }
    
    try {
      await db.run('ALTER TABLE conta ADD COLUMN provider_id TEXT');
      console.log('Coluna provider_id adicionada');
    } catch (error) {
      // Column already exists, ignore error
      console.log('Coluna provider_id já existe');
    }

    await db.run(`CREATE TABLE IF NOT EXISTS artista (
      conta_id INTEGER PRIMARY KEY REFERENCES conta(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT "" NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS genero (
      nome TEXT PRIMARY KEY NOT NULL
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS artista_genero (
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      genero_id TEXT NOT NULL REFERENCES genero(nome) ON DELETE CASCADE,
      PRIMARY KEY (artista_id, genero_id)
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS organizador (
      conta_id INTEGER PRIMARY KEY REFERENCES conta(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT "" NOT NULL,
      telefone TEXT,
      email_contato TEXT,
      site TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Adicionar colunas de contato se não existirem
    try {
      await db.run('ALTER TABLE organizador ADD COLUMN telefone TEXT');
    } catch (error) {}
    
    try {
      await db.run('ALTER TABLE organizador ADD COLUMN email_contato TEXT');
    } catch (error) {}
    
    try {
      await db.run('ALTER TABLE organizador ADD COLUMN site TEXT');
    } catch (error) {}
    
    try {
      await db.run('ALTER TABLE organizador ADD COLUMN tipos_eventos TEXT');
    } catch (error) {}
    
    try {
      await db.run('ALTER TABLE organizador ADD COLUMN capacidade_maxima INTEGER');
    } catch (error) {}

    await db.run(`CREATE TABLE IF NOT EXISTS evento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organizador_id INTEGER NOT NULL REFERENCES organizador(conta_id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      lugar TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      ingressos_venda INTEGER DEFAULT 0,
      preco_ingresso REAL DEFAULT 0,
      ingressos_parceria INTEGER DEFAULT 0,
      capacidade_total INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS evento_artista (
      evento_id INTEGER NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      PRIMARY KEY (evento_id, artista_id)
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS contratacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organizador_id INTEGER NOT NULL REFERENCES organizador(conta_id) ON DELETE CASCADE,
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      data_evento TEXT NOT NULL,
      horario TEXT NOT NULL,
      local TEXT NOT NULL,
      duracao TEXT,
      publico_esperado TEXT,
      nome_contato TEXT NOT NULL,
      email_contato TEXT NOT NULL,
      telefone_contato TEXT NOT NULL,
      observacoes TEXT,
      status TEXT DEFAULT 'pendente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS favorito (
      organizador_id INTEGER NOT NULL REFERENCES organizador(conta_id) ON DELETE CASCADE,
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (organizador_id, artista_id)
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS candidatura (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_id INTEGER NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      mensagem TEXT,
      status TEXT DEFAULT 'pendente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    try {
      await db.run('ALTER TABLE candidatura ADD COLUMN mensagem TEXT');
    } catch (error) {
      // Column already exists
    }

    await db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_candidatura_evento_artista 
      ON candidatura(evento_id, artista_id)`);

    // Inserir gêneros iniciais
    const generos = ['Rock', 'Funk', 'Trap', 'Pagode', 'Sertanejo'];
    for (const genero of generos) {
      await db.run('INSERT OR IGNORE INTO genero (nome) VALUES (?)', [genero]);
    }

    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

module.exports = {
  db,
  initializeDatabase
};
