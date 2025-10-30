const express = require('express');
const Candidatura = require('../models/Candidatura');
const NotificationService = require('../services/NotificationService');
const { authenticateToken, isArtista, isOrganizador } = require('../middleware/auth');

const router = express.Router();

// Artista se candidata a um evento
router.post('/', authenticateToken, isArtista, async (req, res) => {
  try {
    const { eventoId, mensagem } = req.body;
    
    const candidaturaExistente = await Candidatura.verificarCandidatura(eventoId, req.user.id);
    if (candidaturaExistente) {
      return res.status(400).json({ error: 'Você já se candidatou a este evento' });
    }

    const candidaturaId = await Candidatura.criar(eventoId, req.user.id, mensagem);
    
    // Notificar nova candidatura (Observer Pattern)
    const notificationService = new NotificationService();
    notificationService.notifyNewApplication(
      { id: candidaturaId },
      { nome: req.user.nome || 'Artista' },
      { email: 'organizador@connecto.com', telefone: '(11) 99999-9999' }
    );
    
    res.status(201).json({ 
      message: 'Candidatura enviada com sucesso', 
      id: candidaturaId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar candidatura' });
  }
});

// Listar candidaturas de um evento (organizador)
router.get('/evento/:eventoId', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const candidaturas = await Candidatura.buscarPorEvento(req.params.eventoId);
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar candidaturas' });
  }
});

// Listar todas candidaturas do organizador
router.get('/organizador', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const candidaturas = await Candidatura.buscarPorOrganizador(req.user.id);
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar candidaturas' });
  }
});

// Listar candidaturas do artista
router.get('/artista', authenticateToken, isArtista, async (req, res) => {
  try {
    const candidaturas = await Candidatura.buscarPorArtista(req.user.id);
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar candidaturas' });
  }
});

// Atualizar status da candidatura (organizador)
router.put('/:id/status', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const { status } = req.body;
    await Candidatura.atualizarStatus(req.params.id, status);
    
    // Notificar aceitação da candidatura (Observer Pattern)
    if (status === 'aceita') {
      const notificationService = new NotificationService();
      notificationService.notifyApplicationAccepted(
        { id: req.params.id },
        { email: 'artista@connecto.com', telefone: '(11) 88888-8888' }
      );
    }
    
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

module.exports = router;