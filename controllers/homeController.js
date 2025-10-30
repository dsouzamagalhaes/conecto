const Artista = require('../models/Artista');
const Evento = require('../models/Evento');

const homeController = {
    // Renderiza a página inicial
    index: async (req, res) => {
        try {
            // Buscar alguns artistas e eventos para exibir na home
            const artistas = await Artista.getAll();
            const eventos = await Evento.getAll();
            
            res.render('index', {
                title: 'Connecto - Conectando Artistas e Eventos',
                artistas,
                eventos,
                isLoggedIn: false
            });
        } catch (error) {
            console.error('Erro ao carregar página inicial:', error);
            res.render('index', {
                title: 'Connecto - Conectando Artistas e Eventos',
                artistas: [],
                eventos: [],
                isLoggedIn: false
            });
        }
    }
};

module.exports = homeController;