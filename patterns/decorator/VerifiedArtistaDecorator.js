const ArtistaDecorator = require('./ArtistaDecorator');

class VerifiedArtistaDecorator extends ArtistaDecorator {
  getNome() {
    return `${super.getNome()} ✓`;
  }

  getInfo() {
    return {
      ...super.getInfo(),
      verified: true
    };
  }
}

module.exports = VerifiedArtistaDecorator;