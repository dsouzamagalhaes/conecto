const express = require('express');
const Evento = require('../models/Evento');
const EventoService = require('../services/EventoService');
const NotificationService = require('../services/NotificationService');
const { authenticateToken, isOrganizador } = require('../middleware/auth');

const router = express.Router();

// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.buscarTodos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// Test endpoint for debugging (must come before dynamic routes)
router.get('/test', authenticateToken, async (req, res) => {
  try {
    res.json({ 
      message: 'Endpoint funcionando',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no teste' });
  }
});

// Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// Criar evento (apenas organizadores)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'organizador') {
      return res.status(403).json({ error: 'Acesso permitido apenas para organizadores' });
    }
    
    const eventoId = await Evento.criar(req.user.id, req.body);
    
    // Notificar criação do evento (Observer Pattern)
    const notificationService = new NotificationService();
    notificationService.notifyNewEvent(req.body, { 
      email: req.user.email || 'organizador@connecto.com',
      telefone: req.user.telefone || '(11) 99999-9999'
    });
    
    res.status(201).json({ 
      message: 'Evento criado com sucesso', 
      id: eventoId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar evento: ' + error.message });
  }
});

// Atualizar evento (apenas organizador dono)
router.put('/:id', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { descricao, lugar, data } = req.body;
    await Evento.atualizar(req.params.id, { descricao, lugar, data });
    
    res.json({ message: 'Evento atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// Adicionar artista ao evento (apenas organizador dono)
router.post('/:id/artistas/:artistaId', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await Evento.adicionarArtista(req.params.id, req.params.artistaId);
    res.json({ message: 'Artista adicionado ao evento' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar artista' });
  }
});

// Remover artista do evento (apenas organizador dono)
router.delete('/:id/artistas/:artistaId', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await Evento.removerArtista(req.params.id, req.params.artistaId);
    res.json({ message: 'Artista removido do evento' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover artista' });
  }
});

// Listar artistas do evento
router.get('/:id/artistas', async (req, res) => {
  try {
    const artistas = await Evento.buscarArtistas(req.params.id);
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar artistas do evento' });
  }
});

// Criar festival (Composite Pattern)
router.post('/festival', authenticateToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'organizador') {
      return res.status(403).json({ error: 'Acesso permitido apenas para organizadores' });
    }
    
    const eventoService = new EventoService();
    const { nome, eventos } = req.body;
    const festival = await eventoService.criarFestival(nome, eventos);
    
    res.status(201).json({
      message: 'Festival criado com sucesso',
      festival: festival.getInfo()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar festival: ' + error.message });
  }
});

module.exports = router;
