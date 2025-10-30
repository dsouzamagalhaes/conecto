const express = require('express');
const Contratacao = require('../models/Contratacao');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Criar contratação
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'organizador') {
      return res.status(403).json({ error: 'Apenas organizadores podem contratar artistas' });
    }

    const contratacaoId = await Contratacao.criar(req.user.id, req.body.artistaId, req.body);
    res.status(201).json({ message: 'Solicitação enviada com sucesso', id: contratacaoId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar solicitação' });
  }
});

// Listar contratações do organizador
router.get('/organizador', authenticateToken, async (req, res) => {
  try {
    const contratacoes = await Contratacao.buscarPorOrganizador(req.user.id);
    res.json(contratacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contratações' });
  }
});

// Listar contratações do artista
router.get('/artista', authenticateToken, async (req, res) => {
  try {
    const contratacoes = await Contratacao.buscarPorArtista(req.user.id);
    res.json(contratacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contratações' });
  }
});

// Buscar contratação específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contrato = await Contratacao.buscarPorId(req.params.id, req.user.id);
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }
    res.json(contrato);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
});

// Artista aceitar/rejeitar contrato
router.put('/:id/resposta', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const contrato = await Contratacao.buscarPorId(req.params.id);
    
    if (!contrato || contrato.artista_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await Contratacao.atualizarStatus(req.params.id, status);
    
    // Notificar organizador (Observer Pattern)
    const NotificationService = require('../services/NotificationService');
    const notificationService = new NotificationService();
    const message = status === 'confirmado' ? 'Sua proposta foi aceita!' : 'Sua proposta foi rejeitada.';
    notificationService.notificationManager.sendNotification('CONTRACT_RESPONSE', {
      message: `${contrato.artista_nome}: ${message}`,
      email: 'organizador@connecto.com',
      telefone: '(11) 99999-9999'
    });
    
    res.json({ message: 'Resposta enviada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao responder contrato' });
  }
});

module.exports = router;