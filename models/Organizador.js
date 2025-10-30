const { db } = require('./index');

class Organizador {
  static async criar(contaId, nome, descricao = '') {
    await db.run(
      'INSERT INTO organizador (conta_id, nome, descricao) VALUES (?, ?, ?)',
      [contaId, nome, descricao]
    );
    return contaId;
  }

  static async buscarTodos() {
    return await db.all('SELECT * FROM organizador');
  }

  static async buscarPorId(id) {
    return await db.get('SELECT * FROM organizador WHERE conta_id = ?', [id]);
  }

  static async atualizar(id, dados) {
    const { nome, descricao, tipos_eventos, capacidade_maxima } = dados;
    const updates = [];
    const params = [];

    if (nome) {
      updates.push('nome = ?');
      params.push(nome);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (tipos_eventos !== undefined) {
      updates.push('tipos_eventos = ?');
      params.push(tipos_eventos);
    }
    if (capacidade_maxima !== undefined) {
      updates.push('capacidade_maxima = ?');
      params.push(capacidade_maxima);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.run(
        `UPDATE organizador SET ${updates.join(', ')} WHERE conta_id = ?`,
        params
      );
    }
  }

  static async existe(id) {
    const organizador = await db.get('SELECT 1 FROM organizador WHERE conta_id = ?', [id]);
    return !!organizador;
  }

  static async atualizarContato(id, dados) {
    const { telefone, email, site } = dados;
    const updates = [];
    const params = [];

    if (telefone !== undefined) {
      updates.push('telefone = ?');
      params.push(telefone);
    }
    if (email !== undefined) {
      updates.push('email_contato = ?');
      params.push(email);
    }
    if (site !== undefined) {
      updates.push('site = ?');
      params.push(site);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.run(
        `UPDATE organizador SET ${updates.join(', ')} WHERE conta_id = ?`,
        params
      );
    }
  }
}

module.exports = Organizador;
