const { db } = require('./index');

class Contratacao {
  static async criar(organizadorId, artistaId, dados) {
    const { data, horario, local, duracao, publico, nome, email, telefone, observacoes } = dados;
    
    const result = await db.run(`
      INSERT INTO contratacao (
        organizador_id, artista_id, data_evento, horario, local, 
        duracao, publico_esperado, nome_contato, email_contato, 
        telefone_contato, observacoes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente', datetime('now'))
    `, [organizadorId, artistaId, data, horario, local, duracao, publico, nome, email, telefone, observacoes]);
    
    return result.id;
  }

  static async buscarPorOrganizador(organizadorId) {
    return await db.all(`
      SELECT c.*, a.nome as artista_nome 
      FROM contratacao c
      JOIN artista a ON c.artista_id = a.conta_id
      WHERE c.organizador_id = ?
      ORDER BY c.created_at DESC
    `, [organizadorId]);
  }

  static async buscarPorArtista(artistaId) {
    return await db.all(`
      SELECT c.*, o.nome as organizador_nome 
      FROM contratacao c
      JOIN organizador o ON c.organizador_id = o.conta_id
      WHERE c.artista_id = ?
      ORDER BY c.created_at DESC
    `, [artistaId]);
  }

  static async atualizarStatus(id, status) {
    await db.run('UPDATE contratacao SET status = ? WHERE id = ?', [status, id]);
  }

  static async buscarPorOrganizador(organizadorId) {
    return await db.all(`
      SELECT c.*, a.nome as artista_nome 
      FROM contratacao c
      JOIN artista a ON c.artista_id = a.conta_id
      WHERE c.organizador_id = ?
      ORDER BY c.created_at DESC
    `, [organizadorId]);
  }

  static async buscarPorId(id, userId = null) {
    if (userId) {
      return await db.get(`
        SELECT c.*, a.nome as artista_nome, o.nome as organizador_nome 
        FROM contratacao c
        JOIN artista a ON c.artista_id = a.conta_id
        JOIN organizador o ON c.organizador_id = o.conta_id
        WHERE c.id = ? AND (c.organizador_id = ? OR c.artista_id = ?)
      `, [id, userId, userId]);
    } else {
      return await db.get(`
        SELECT c.*, a.nome as artista_nome, o.nome as organizador_nome 
        FROM contratacao c
        JOIN artista a ON c.artista_id = a.conta_id
        JOIN organizador o ON c.organizador_id = o.conta_id
        WHERE c.id = ?
      `, [id]);
    }
  }
}

module.exports = Contratacao;