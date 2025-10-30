const express = require('express');
const ArtistaController = require('../controllers/artistaController');
const ArtistaService = require('../services/ArtistaService');
const { authenticateToken } = require('../middleware/auth');
const { artistaUpdateValidation } = require('../middleware/validation');

const router = express.Router();

// Listar todos os artistas
router.get('/', ArtistaController.listarTodos);

// Visualizar perfil do artista (página)
router.get('/perfil/:id', ArtistaController.visualizarPerfil);

// Buscar artista por ID (API)
router.get('/:id', ArtistaController.buscarPorId);

// Atualizar perfil do artista (apenas próprio)
router.put('/:id', authenticateToken, artistaUpdateValidation, ArtistaController.atualizar);

// Atualizar perfil do artista logado
router.put('/perfil', authenticateToken, artistaUpdateValidation, ArtistaController.atualizarPerfil);

// Atualizar contato do artista logado
router.put('/contato', authenticateToken, ArtistaController.atualizarContato);

// Buscar artistas por gênero
router.get('/genero/:genero', ArtistaController.buscarPorGenero);

// Buscar artistas com padrões (Strategy)
router.get('/buscar', async (req, res) => {
  try {
    const artistaService = new ArtistaService();
    const artistas = await artistaService.buscarArtistas(req.query);
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar artistas decorados
router.get('/decorados', async (req, res) => {
  try {
    const artistaService = new ArtistaService();
    const artistas = await artistaService.buscarArtistas({});
    const artistasDecorados = artistas.map(artista => {
      const options = {
        premium: Math.random() > 0.7,
        verified: Math.random() > 0.5
      };
      return artistaService.decorateArtista(artista, options).getInfo();
    });
    res.json(artistasDecorados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
