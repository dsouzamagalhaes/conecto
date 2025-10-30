class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async executeSearch(criteria) {
    return await this.strategy.search(criteria);
  }
}

module.exports = SearchContext;