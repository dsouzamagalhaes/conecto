const SearchStrategy = require('./SearchStrategy');
const { db } = require('../../models/index');

class NameSearchStrategy extends SearchStrategy {
  async search(criteria) {
    const query = `
      SELECT a.conta_id as id, a.nome, a.descricao
      FROM artista a
      WHERE a.nome LIKE ?
    `;
    return await db.all(query, [`%${criteria.nome}%`]);
  }
}

module.exports = NameSearchStrategy;