// Strategy Pattern - Interface para estratégias de busca
class SearchStrategy {
  async search(criteria) {
    throw new Error('Método search deve ser implementado');
  }
}

module.exports = SearchStrategy;