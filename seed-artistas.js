const { initializeDatabase, db } = require('./models');
const Artista = require('./models/Artista');

async function seedArtistas() {
    try {
        await initializeDatabase();
        
        const artistas = [
            {
                nome: 'Luna Synthwave',
                email: 'luna@synthwave.com',
                telefone: '(11) 99999-1111',
                genero_id: 3,
                preco: 5000.00,
                biografia: 'Artista de música eletrônica com foco em synthwave e música futurística.',
                portfolio: 'https://lunasynthwave.com'
            },
            {
                nome: 'Cyber Phoenix',
                email: 'cyber@phoenix.com',
                telefone: '(11) 99999-2222',
                genero_id: 1,
                preco: 8000.00,
                biografia: 'Banda de rock cyberpunk com performances energéticas e visuais impressionantes.',
                portfolio: 'https://cyberphoenix.com'
            },
            {
                nome: 'Neon Dreams',
                email: 'neon@dreams.com',
                telefone: '(11) 99999-3333',
                genero_id: 2,
                preco: 6500.00,
                biografia: 'Artista pop experimental com elementos visuais neon e performances únicas.',
                portfolio: 'https://neondreams.com'
            }
        ];

        for (const artistaData of artistas) {
            // Primeiro criar conta
            const contaResult = await db.run(
                'INSERT INTO conta (email, senha_hash) VALUES (?, ?)',
                [artistaData.email, 'senha123']
            );
            
            // Depois criar artista
            await db.run(
                'INSERT INTO artista (conta_id, nome, descricao) VALUES (?, ?, ?)',
                [contaResult.lastID, artistaData.nome, artistaData.biografia]
            );
            
            console.log(`Artista ${artistaData.nome} criado com sucesso!`);
        }

        console.log('Todos os artistas foram inseridos no banco de dados!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao inserir artistas:', error);
        process.exit(1);
    }
}

seedArtistas();