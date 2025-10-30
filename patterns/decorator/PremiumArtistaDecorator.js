const ArtistaDecorator = require('./ArtistaDecorator');

class PremiumArtistaDecorator extends ArtistaDecorator {
  getDescricao() {
    return `⭐ PREMIUM: ${super.getDescricao()}`;
  }

  getInfo() {
    return {
      ...super.getInfo(),
      premium: true,
      destaque: true
    };
  }
}

module.exports = PremiumArtistaDecorator;