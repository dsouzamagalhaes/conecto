const SearchContext = require('../patterns/strategy/SearchContext');
const GenreSearchStrategy = require('../patterns/strategy/GenreSearchStrategy');
const NameSearchStrategy = require('../patterns/strategy/NameSearchStrategy');
const ArtistaDecorator = require('../patterns/decorator/ArtistaDecorator');
const PremiumArtistaDecorator = require('../patterns/decorator/PremiumArtistaDecorator');
const VerifiedArtistaDecorator = require('../patterns/decorator/VerifiedArtistaDecorator');
const Artista = require('../models/Artista');

class ArtistaService {
  constructor() {
    this.searchContext = new SearchContext(new NameSearchStrategy());
  }

  async buscarArtistas(criteria) {
    if (criteria.genero) {
      this.searchContext.setStrategy(new GenreSearchStrategy());
      return await this.searchContext.executeSearch(criteria);
    }
    
    if (criteria.nome) {
      this.searchContext.setStrategy(new NameSearchStrategy());
      return await this.searchContext.executeSearch(criteria);
    }

    return await Artista.buscarTodos();
  }

  decorateArtista(artista, options = {}) {
    let decoratedArtista = new ArtistaDecorator(artista);
    
    if (options.premium) {
      decoratedArtista = new PremiumArtistaDecorator(decoratedArtista);
    }
    
    if (options.verified) {
      decoratedArtista = new VerifiedArtistaDecorator(decoratedArtista);
    }
    
    return decoratedArtista;
  }
}

module.exports = ArtistaService;