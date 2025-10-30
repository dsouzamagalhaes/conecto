const { initializeDatabase } = require('./models');
const Conta = require('./models/Conta');
const Artista = require('./models/Artista');
const Organizador = require('./models/Organizador');
const Evento = require('./models/Evento');

async function seedDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    await initializeDatabase();

    // Criar contas de artistas
    console.log('Criando artistas...');
    
    const artistaConta1 = await Conta.criar('luna@synthwave.com', '123456');
    await Artista.criar(artistaConta1, 'Luna Synthwave', 'Artista de música eletrônica especializada em synthwave e música futurística');

    const artistaConta2 = await Conta.criar('cyber@phoenix.com', '123456');
    await Artista.criar(artistaConta2, 'Cyber Phoenix', 'Banda de rock cyberpunk com elementos eletrônicos');

    const artistaConta3 = await Conta.criar('neon@dreams.com', '123456');
    await Artista.criar(artistaConta3, 'Neon Dreams', 'Artista pop experimental com visuais impressionantes');

    const artistaConta4 = await Conta.criar('digital@beats.com', '123456');
    await Artista.criar(artistaConta4, 'Digital Beats', 'DJ especializado em música eletrônica e house');

    const artistaConta5 = await Conta.criar('stellar@sounds.com', '123456');
    await Artista.criar(artistaConta5, 'Stellar Sounds', 'Banda indie rock com influências espaciais');

    // Criar contas de organizadores
    console.log('Criando organizadores...');
    
    const orgConta1 = await Conta.criar('eventos@techfest.com', '123456');
    await Organizador.criar(orgConta1, 'TechFest Events', 'Organizadora especializada em eventos de tecnologia e inovação');

    const orgConta2 = await Conta.criar('contato@musicvenue.com', '123456');
    await Organizador.criar(orgConta2, 'Music Venue', 'Casa de shows premium para eventos musicais');

    const orgConta3 = await Conta.criar('info@festivais.com', '123456');
    await Organizador.criar(orgConta3, 'Festivais Brasil', 'Organizadora de festivais de música em todo o Brasil');

    // Criar eventos
    console.log('Criando eventos...');
    
    await Evento.criar(orgConta1, 'Tech Summit 2025 - Conferência de Tecnologia', 'Centro de Convenções BH', '2025-03-15');
    await Evento.criar(orgConta2, 'Noite Eletrônica - Festival de Música', 'Espaço Music Venue', '2025-02-20');
    await Evento.criar(orgConta3, 'Festival de Verão - 3 Dias de Música', 'Parque Municipal', '2025-01-25');
    await Evento.criar(orgConta1, 'Startup Weekend - Evento de Empreendedorismo', 'Hub de Inovação', '2025-04-10');
    await Evento.criar(orgConta2, 'Rock Night - Noite do Rock Nacional', 'Music Venue', '2025-02-05');

    console.log('Banco de dados populado com sucesso!');
    console.log('Dados criados:');
    console.log('- 5 Artistas');
    console.log('- 3 Organizadores');
    console.log('- 5 Eventos');
    
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };