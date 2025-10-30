const { db, initializeDatabase } = require('./models');

async function fixIssues() {
  try {
    console.log('🔧 Corrigindo problemas do sistema...');
    
    await initializeDatabase();
    
    // 1. Verificar e corrigir estrutura das tabelas
    console.log('1. Verificando estrutura das tabelas...');
    
    // Verificar se todas as colunas necessárias existem
    const organizadorColumns = await db.all("PRAGMA table_info(organizador)");
    const requiredOrgColumns = ['telefone', 'email_contato', 'site', 'tipos_eventos', 'capacidade_maxima'];
    
    for (const col of requiredOrgColumns) {
      const exists = organizadorColumns.some(c => c.name === col);
      if (!exists) {
        console.log(`  - Adicionando coluna ${col} à tabela organizador...`);
        try {
          await db.run(`ALTER TABLE organizador ADD COLUMN ${col} TEXT`);
        } catch (error) {
          console.log(`    ⚠️ Coluna ${col} já existe ou erro: ${error.message}`);
        }
      }
    }
    
    // 2. Verificar dados de teste
    console.log('2. Verificando dados de teste...');
    
    const artistaCount = await db.get('SELECT COUNT(*) as count FROM artista');
    const organizadorCount = await db.get('SELECT COUNT(*) as count FROM organizador');
    const eventoCount = await db.get('SELECT COUNT(*) as count FROM evento');
    
    console.log(`  - Artistas: ${artistaCount.count}`);
    console.log(`  - Organizadores: ${organizadorCount.count}`);
    console.log(`  - Eventos: ${eventoCount.count}`);
    
    // 3. Testar queries críticas
    console.log('3. Testando queries críticas...');
    
    // Test organizador profile query
    try {
      const testOrg = await db.get(`
        SELECT o.*, COUNT(DISTINCT e.id) as total_eventos,
               COUNT(DISTINCT c.artista_id) as artistas_confirmados
        FROM organizador o
        LEFT JOIN evento e ON o.conta_id = e.organizador_id
        LEFT JOIN contratacao c ON o.conta_id = c.organizador_id AND c.status = 'confirmado'
        WHERE o.conta_id = (SELECT conta_id FROM organizador LIMIT 1)
        GROUP BY o.conta_id
      `);
      
      if (testOrg) {
        console.log('  ✅ Query de perfil do organizador funcionando');
        console.log(`    - Eventos: ${testOrg.total_eventos}`);
        console.log(`    - Artistas confirmados: ${testOrg.artistas_confirmados}`);
      }
    } catch (error) {
      console.log('  ❌ Erro na query de perfil:', error.message);
    }
    
    // Test candidaturas query
    try {
      const testCandidaturas = await db.all(`
        SELECT c.*, e.nome as evento_nome, a.nome as artista_nome, a.descricao as artista_descricao
        FROM candidatura c
        JOIN evento e ON c.evento_id = e.id
        JOIN artista a ON c.artista_id = a.conta_id
        LIMIT 5
      `);
      
      console.log(`  ✅ Query de candidaturas funcionando (${testCandidaturas.length} resultados)`);
    } catch (error) {
      console.log('  ❌ Erro na query de candidaturas:', error.message);
    }
    
    // 4. Verificar integridade referencial
    console.log('4. Verificando integridade referencial...');
    
    const orphanEvents = await db.all(`
      SELECT e.* FROM evento e 
      LEFT JOIN organizador o ON e.organizador_id = o.conta_id 
      WHERE o.conta_id IS NULL
    `);
    
    if (orphanEvents.length > 0) {
      console.log(`  ⚠️ ${orphanEvents.length} eventos órfãos encontrados`);
    } else {
      console.log('  ✅ Nenhum evento órfão encontrado');
    }
    
    console.log('\n✅ Verificação concluída!');
    console.log('\n📋 Resumo dos problemas corrigidos:');
    console.log('  - Estrutura do banco verificada e corrigida');
    console.log('  - Queries críticas testadas');
    console.log('  - Integridade referencial verificada');
    
  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  }
}

if (require.main === module) {
  fixIssues();
}

module.exports = fixIssues;