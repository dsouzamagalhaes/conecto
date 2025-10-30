const SearchStrategy = require('./SearchStrategy');
const Artista = require('../../models/Artista');

class GenreSearchStrategy extends SearchStrategy {
  async search(criteria) {
    return await Artista.buscarPorGenero(criteria.genero);
  }
}

module.exports = GenreSearchStrategy;