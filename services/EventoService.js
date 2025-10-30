const Festival = require('../patterns/composite/Festival');
const SimpleEvent = require('../patterns/composite/SimpleEvent');
const Evento = require('../models/Evento');

class EventoService {
  async criarFestival(nome, eventos) {
    const festival = new Festival(nome);
    
    for (const eventoData of eventos) {
      const evento = new SimpleEvent(
        eventoData.nome,
        eventoData.data,
        eventoData.local
      );
      festival.add(evento);
    }
    
    return festival;
  }

  async buscarEventos() {
    return await Evento.buscarTodos();
  }
}

module.exports = EventoService;