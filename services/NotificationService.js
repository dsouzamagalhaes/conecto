const NotificationManager = require('../patterns/observer/NotificationManager');

class NotificationService {
  constructor() {
    this.notificationManager = new NotificationManager();
  }

  notifyNewEvent(evento, organizador) {
    this.notificationManager.sendNotification('NEW_EVENT', {
      message: `Novo evento: ${evento.nome}`,
      email: organizador.email,
      telefone: organizador.telefone
    });
  }

  notifyNewApplication(candidatura, artista, organizador) {
    this.notificationManager.sendNotification('NEW_APPLICATION', {
      message: `${artista.nome} se candidatou ao seu evento`,
      email: organizador.email,
      telefone: organizador.telefone
    });
  }

  notifyApplicationAccepted(candidatura, artista) {
    this.notificationManager.sendNotification('APPLICATION_ACCEPTED', {
      message: 'Sua candidatura foi aceita!',
      email: artista.email,
      telefone: artista.telefone
    });
  }
}

module.exports = NotificationService;