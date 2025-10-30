const express = require('express');
const Favorito = require('../models/Favorito');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Adicionar/remover favorito
router.post('/:artistaId', authenticateToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'organizador') {
      return res.status(403).json({ error: 'Apenas organizadores podem favoritar artistas' });
    }

    const jaFavoritado = await Favorito.verificar(req.user.id, req.params.artistaId);
    
    if (jaFavoritado) {
      await Favorito.remover(req.user.id, req.params.artistaId);
      res.json({ favoritado: false, message: 'Removido dos favoritos' });
    } else {
      await Favorito.adicionar(req.user.id, req.params.artistaId);
      res.json({ favoritado: true, message: 'Adicionado aos favoritos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar favorito' });
  }
});

// Verificar se é favorito
router.get('/:artistaId', authenticateToken, async (req, res) => {
  try {
    const favoritado = await Favorito.verificar(req.user.id, req.params.artistaId);
    res.json({ favoritado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar favorito' });
  }
});

// Listar favoritos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favoritos = await Favorito.buscarPorOrganizador(req.user.id);
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
});

module.exports = router;