const { db } = require('./index');
const bcrypt = require('bcrypt');

class Conta {
  static async criar(email, senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    const result = await db.run(
      'INSERT INTO conta (email, senha_hash) VALUES (?, ?)',
      [email, senhaHash]
    );
    return result.id;
  }

  static async buscarPorEmail(email) {
    return await db.get('SELECT * FROM conta WHERE email = ?', [email]);
  }

  static async buscarPorId(id) {
    return await db.get('SELECT id, email, created_at FROM conta WHERE id = ?', [id]);
  }

  static async verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }

  static async deletar(id) {
    await db.run('DELETE FROM conta WHERE id = ?', [id]);
  }

  static async atualizarSenha(id, novaSenha) {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await db.run('UPDATE conta SET senha_hash = ? WHERE id = ?', [senhaHash, id]);
  }

  static async criarSocial(email, provider, providerId) {
    try {
      console.log('Criando conta social:', { email, provider, providerId });
      
      // Tentar com colunas provider primeiro
      try {
        const result = await db.run(
          'INSERT INTO conta (email, senha_hash, provider, provider_id) VALUES (?, ?, ?, ?)',
          [email, 'social-login', provider, providerId]
        );
        console.log('Conta social criada com sucesso (com provider), ID:', result.id);
        return result.id;
      } catch (providerError) {
        console.log('Erro com colunas provider, tentando sem elas:', providerError.message);
        
        // Fallback: criar sem as colunas provider
        const result = await db.run(
          'INSERT INTO conta (email, senha_hash) VALUES (?, ?)',
          [email, 'social-login']
        );
        console.log('Conta social criada com sucesso (sem provider), ID:', result.id);
        return result.id;
      }
    } catch (error) {
      console.error('Erro ao criar conta social:', error);
      throw error;
    }
  }
}

module.exports = Conta;
