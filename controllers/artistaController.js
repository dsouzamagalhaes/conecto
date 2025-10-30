const Artista = require('../models/Artista');

class ArtistaController {
  static async listarTodos(req, res) {
    try {
      const artistas = await Artista.buscarTodos();
      res.json(artistas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar artistas' });
    }
  }

  static async visualizarPerfil(req, res) {
    try {
      const artista = await Artista.buscarPorId(req.params.id);
      if (!artista) {
        return res.status(404).render('error', { message: 'Artista não encontrado' });
      }
      res.render('perfil-artista-publico', { artista });
    } catch (error) {
      res.status(500).render('error', { message: 'Erro ao carregar perfil' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const artista = await Artista.buscarPorId(req.params.id);
      if (!artista) {
        return res.status(404).json({ error: 'Artista não encontrado' });
      }
      res.json(artista);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar artista' });
    }
  }

  static async atualizar(req, res) {
    try {
      if (parseInt(req.params.id) !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { nome, descricao, generos } = req.body;

      // Atualizar dados básicos
      if (nome || descricao) {
        await Artista.atualizar(req.params.id, { nome, descricao });
      }

      // Atualizar gêneros se fornecidos
      if (generos && Array.isArray(generos)) {
        await Artista.adicionarGeneros(req.params.id, generos);
      }

      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  static async buscarPorGenero(req, res) {
    try {
      const artistas = await Artista.buscarPorGenero(req.params.genero);
      res.json(artistas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar artistas' });
    }
  }

  static async atualizarPerfil(req, res) {
    try {
      const { nome, descricao, generos } = req.body;

      // Atualizar dados básicos
      if (nome || descricao) {
        await Artista.atualizar(req.user.id, { nome, descricao });
      }

      // Atualizar gêneros se fornecidos
      if (generos && Array.isArray(generos)) {
        await Artista.adicionarGeneros(req.user.id, generos);
      }

      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  static async atualizarContato(req, res) {
    try {
      const { telefone, email, site } = req.body;
      await Artista.atualizarContato(req.user.id, { telefone, email, site });
      
      res.json({ message: 'Contato atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar contato' });
    }
  }
}

module.exports = ArtistaController;
