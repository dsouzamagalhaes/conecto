const { initializeDatabase } = require('./models');

async function testSystem() {
  try {
    console.log('🔄 Inicializando banco de dados...');
    await initializeDatabase();
    console.log('✅ Banco de dados inicializado com sucesso');

    // Test models
    console.log('🔄 Testando modelos...');
    
    const Artista = require('./models/Artista');
    const Organizador = require('./models/Organizador');
    const Evento = require('./models/Evento');
    const Candidatura = require('./models/Candidatura');
    const Contratacao = require('./models/Contratacao');

    // Test Artista methods
    console.log('  - Testando Artista.buscarTodos()...');
    const artistas = await Artista.buscarTodos();
    console.log(`    ✅ ${artistas.length} artistas encontrados`);

    // Test Organizador methods
    console.log('  - Testando Organizador.buscarTodos()...');
    const organizadores = await Organizador.buscarTodos();
    console.log(`    ✅ ${organizadores.length} organizadores encontrados`);

    // Test Evento methods
    console.log('  - Testando Evento.buscarTodos()...');
    const eventos = await Evento.buscarTodos();
    console.log(`    ✅ ${eventos.length} eventos encontrados`);

    console.log('✅ Todos os testes passaram!');
    console.log('\n🚀 Sistema pronto para uso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testSystem();
}

module.exports = testSystem;