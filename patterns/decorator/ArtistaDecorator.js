// Decorator Pattern - Base decorator para artistas
class ArtistaDecorator {
  constructor(artista) {
    this.artista = artista;
  }

  getNome() {
    return this.artista.nome;
  }

  getDescricao() {
    return this.artista.descricao;
  }

  getInfo() {
    return {
      id: this.artista.id,
      nome: this.getNome(),
      descricao: this.getDescricao()
    };
  }
}

module.exports = ArtistaDecorator;