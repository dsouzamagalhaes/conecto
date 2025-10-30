// Composite Pattern - Interface para componentes de evento
class EventComponent {
  constructor(nome) {
    this.nome = nome;
  }

  add(component) {
    throw new Error('Método add deve ser implementado');
  }

  remove(component) {
    throw new Error('Método remove deve ser implementado');
  }

  getInfo() {
    throw new Error('Método getInfo deve ser implementado');
  }
}

module.exports = EventComponent;