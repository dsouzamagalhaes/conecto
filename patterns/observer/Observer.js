// Observer Pattern - Interface para observadores
class Observer {
  update(data) {
    throw new Error('Método update deve ser implementado');
  }
}

module.exports = Observer;