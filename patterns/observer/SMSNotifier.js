const Observer = require('./Observer');

class SMSNotifier extends Observer {
  update(data) {
    console.log(`📱 SMS enviado para ${data.telefone}: ${data.message}`);
  }
}

module.exports = SMSNotifier;