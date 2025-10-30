const EventComponent = require('./EventComponent');

class SimpleEvent extends EventComponent {
  constructor(nome, data, local) {
    super(nome);
    this.data = data;
    this.local = local;
  }

  add(component) {
    // Evento simples não pode ter filhos
  }

  remove(component) {
    // Evento simples não pode ter filhos
  }

  getInfo() {
    return {
      nome: this.nome,
      data: this.data,
      local: this.local,
      tipo: 'evento'
    };
  }
}

module.exports = SimpleEvent;