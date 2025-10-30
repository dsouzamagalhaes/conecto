const { db } = require('./index');

class Favorito {
  static async adicionar(organizadorId, artistaId) {
    try {
      await db.run(`
        INSERT INTO favorito (organizador_id, artista_id, created_at) 
        VALUES (?, ?, datetime('now'))
      `, [organizadorId, artistaId]);
      return true;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return false; // Já existe
      }
      throw error;
    }
  }

  static async remover(organizadorId, artistaId) {
    await db.run('DELETE FROM favorito WHERE organizador_id = ? AND artista_id = ?', [organizadorId, artistaId]);
  }

  static async verificar(organizadorId, artistaId) {
    const favorito = await db.get(
      'SELECT 1 FROM favorito WHERE organizador_id = ? AND artista_id = ?', 
      [organizadorId, artistaId]
    );
    return !!favorito;
  }

  static async buscarPorOrganizador(organizadorId) {
    return await db.all(`
      SELECT a.conta_id as id, a.nome, a.descricao, f.created_at as favoritado_em
      FROM favorito f
      JOIN artista a ON f.artista_id = a.conta_id
      WHERE f.organizador_id = ?
      ORDER BY f.created_at DESC
    `, [organizadorId]);
  }
}

module.exports = Favorito;