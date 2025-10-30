const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initializeDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const artistaRoutes = require('./routes/artistas');
const organizadorRoutes = require('./routes/organizadores');
const eventoRoutes = require('./routes/eventos');
const generoRoutes = require('./routes/generos');
const homeRoutes = require('./routes/home');
const contratacaoRoutes = require('./routes/contratacoes');
const favoritoRoutes = require('./routes/favoritos');
const candidaturaRoutes = require('./routes/candidaturas');
const { webAuthMiddleware } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('.'));

// Debug middleware
app.use('/api/*', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers.authorization ? 'Token present' : 'No token');
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/artistas', artistaRoutes);
app.use('/api/organizadores', organizadorRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/generos', generoRoutes);
app.use('/api/contratacoes', contratacaoRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/candidaturas', candidaturaRoutes);

// Rotas para páginas
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login - Connecto' });
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { title: 'Cadastro - Connecto' });
});

app.get('/artistas', async (req, res) => {
  try {
    const Artista = require('./models/Artista');
    const artistas = await Artista.getAll();
    res.render('artistas', { 
      title: 'Artistas - Connecto',
      artistas: artistas || [],
      isLoggedIn: false
    });
  } catch (error) {
    console.error('Erro ao carregar artistas:', error);
    res.render('artistas', { 
      title: 'Artistas - Connecto',
      artistas: [],
      isLoggedIn: false
    });
  }
});

app.get('/eventos', async (req, res) => {
  try {
    const Evento = require('./models/Evento');
    const eventos = await Evento.getAll();
    res.render('eventos', { 
      title: 'Eventos - Connecto',
      eventos: eventos || [],
      isLoggedIn: false
    });
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    res.render('eventos', { 
      title: 'Eventos - Connecto',
      eventos: [],
      isLoggedIn: false
    });
  }
});

// Rotas de perfil (protegidas)
app.get('/perfil-artista', webAuthMiddleware, async (req, res) => {
  try {
    const Artista = require('./models/Artista');
    const Candidatura = require('./models/Candidatura');
    const artista = await Artista.buscarPorId(req.user.id);
    
    if (!artista) {
      return res.redirect('/login');
    }
    
    const user = {
      ...req.user,
      nome: artista.nome,
      descricao: artista.descricao
    };
    
    const candidaturas = await Candidatura.buscarPorArtista(req.user.id);
    const Contratacao = require('./models/Contratacao');
    const contratos = await Contratacao.buscarPorArtista(req.user.id);
    
    res.render('perfil-artista', { 
      title: 'Meu Perfil - Connecto',
      user: user,
      candidaturas: candidaturas || [],
      contratos: contratos || []
    });
  } catch (error) {
    console.error('Erro ao carregar perfil do artista:', error);
    res.redirect('/login');
  }
});

app.get('/eventos-artista', async (req, res) => {
  try {
    const Evento = require('./models/Evento');
    const eventos = await Evento.getAll();
    res.render('eventos-artista', { 
      title: 'Oportunidades - Connecto',
      eventos: eventos || []
    });
  } catch (error) {
    console.error('Erro ao carregar eventos para artistas:', error);
    res.render('eventos-artista', { 
      title: 'Oportunidades - Connecto',
      eventos: []
    });
  }
});

// Rota para perfil público do artista
app.get('/artistas/perfil/:id', async (req, res) => {
  try {
    const Artista = require('./models/Artista');
    const artista = await Artista.buscarPorId(req.params.id);
    
    if (!artista) {
      return res.status(404).render('error', { 
        title: 'Artista não encontrado - Connecto',
        message: 'Artista não encontrado' 
      });
    }
    
    res.render('perfil-artista-publico', { 
      title: `${artista.nome} - Connecto`,
      artista: artista
    });
  } catch (error) {
    console.error('Erro ao carregar perfil do artista:', error);
    res.status(500).render('error', { 
      title: 'Erro - Connecto',
      message: 'Erro ao carregar perfil' 
    });
  }
});

app.get('/perfil-organizador', webAuthMiddleware, async (req, res) => {
  try {
    const Organizador = require('./models/Organizador');
    const Evento = require('./models/Evento');
    const Candidatura = require('./models/Candidatura');
    const Contratacao = require('./models/Contratacao');
    
    const organizador = await Organizador.buscarPorId(req.user.id);
    
    if (!organizador) {
      return res.redirect('/login');
    }
    
    const user = {
      ...req.user,
      nome: organizador.nome,
      descricao: organizador.descricao,
      telefone: organizador.telefone,
      email_contato: organizador.email_contato,
      site: organizador.site,
      tipos_eventos: organizador.tipos_eventos,
      capacidade_maxima: organizador.capacidade_maxima
    };
    
    const eventos = await Evento.buscarPorOrganizador(req.user.id);
    const candidaturas = await Candidatura.buscarPorOrganizador(req.user.id);
    const contratos = await Contratacao.buscarPorOrganizador(req.user.id);
    
    // Calcular estatísticas
    const totalEventos = eventos ? eventos.length : 0;
    const artistasConfirmados = contratos ? [...new Set(contratos.filter(c => c.status === 'confirmado').map(c => c.artista_id))].length : 0;
    const avaliacoes = 0; // Placeholder para futuro sistema de avaliações
    
    res.render('perfil-organizador', { 
      title: 'Meu Perfil - Connecto',
      user: user,
      eventos: eventos || [],
      candidaturas: candidaturas || [],
      contratos: contratos || [],
      stats: {
        eventos: totalEventos,
        artistas: artistasConfirmados,
        avaliacoes: avaliacoes
      }
    });
  } catch (error) {
    console.error('Erro ao carregar perfil do organizador:', error);
    res.redirect('/login');
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Rota para limpar auth (debug)
app.get('/clear-auth', (req, res) => {
  res.clearCookie('token');
  res.send(`
    <script>
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
      alert('Dados de autenticação limpos!');
      window.location.href = '/login';
    </script>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
