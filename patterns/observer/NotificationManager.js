const Subject = require('./Subject');
const EmailNotifier = require('./EmailNotifier');
const SMSNotifier = require('./SMSNotifier');

class NotificationManager extends Subject {
  constructor() {
    super();
    this.addObserver(new EmailNotifier());
    this.addObserver(new SMSNotifier());
  }

  sendNotification(type, data) {
    const notification = {
      type,
      timestamp: new Date(),
      ...data
    };
    this.notifyObservers(notification);
  }
}

module.exports = NotificationManager;