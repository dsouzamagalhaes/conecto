const Observer = require('./Observer');

class EmailNotifier extends Observer {
  update(data) {
    console.log(`📧 Email enviado para ${data.email}: ${data.message}`);
  }
}

module.exports = EmailNotifier;