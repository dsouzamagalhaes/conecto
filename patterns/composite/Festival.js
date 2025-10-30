const EventComponent = require('./EventComponent');

class Festival extends EventComponent {
  constructor(nome) {
    super(nome);
    this.eventos = [];
  }

  add(component) {
    this.eventos.push(component);
  }

  remove(component) {
    const index = this.eventos.indexOf(component);
    if (index > -1) {
      this.eventos.splice(index, 1);
    }
  }

  getInfo() {
    return {
      nome: this.nome,
      tipo: 'festival',
      eventos: this.eventos.map(evento => evento.getInfo()),
      totalEventos: this.eventos.length
    };
  }
}

module.exports = Festival;