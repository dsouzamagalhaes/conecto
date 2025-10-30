const { db } = require('./index');

class Candidatura {
  static async criar(eventoId, artistaId, mensagem = null) {
    const result = await db.run(
      'INSERT INTO candidatura (evento_id, artista_id, mensagem) VALUES (?, ?, ?)',
      [eventoId, artistaId, mensagem]
    );
    return result.id;
  }

  static async buscarPorEvento(eventoId) {
    const query = `
      SELECT c.*, a.nome as artista_nome, a.descricao as artista_descricao
      FROM candidatura c
      JOIN artista a ON c.artista_id = a.conta_id
      WHERE c.evento_id = ?
      ORDER BY c.created_at DESC
    `;
    return await db.all(query, [eventoId]);
  }

  static async buscarPorArtista(artistaId) {
    const query = `
      SELECT c.*, e.nome as evento_nome, e.descricao as evento_descricao
      FROM candidatura c
      JOIN evento e ON c.evento_id = e.id
      WHERE c.artista_id = ?
      ORDER BY c.created_at DESC
    `;
    return await db.all(query, [artistaId]);
  }

  static async buscarPorOrganizador(organizadorId) {
    const query = `
      SELECT c.*, e.nome as evento_nome, a.nome as artista_nome, a.descricao as artista_descricao
      FROM candidatura c
      JOIN evento e ON c.evento_id = e.id
      JOIN artista a ON c.artista_id = a.conta_id
      WHERE e.organizador_id = ?
      ORDER BY c.created_at DESC
    `;
    return await db.all(query, [organizadorId]);
  }

  static async atualizarStatus(id, status) {
    await db.run(
      'UPDATE candidatura SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async verificarCandidatura(eventoId, artistaId) {
    return await db.get(
      'SELECT * FROM candidatura WHERE evento_id = ? AND artista_id = ?',
      [eventoId, artistaId]
    );
  }
}

module.exports = Candidatura;