Connecto
========

Daniel Souza - 22300392

Matheus Faccio - 22400737

Marcello Dias - 22401920
 
Thiago Bernardes - 22201998

Samuel Maia - 22302115

João Conti - 22300260

O projeto Connceto consiste na criação de um site inovador com a proposta de conectar artistas, casas de shows e organizadores de eventos de forma mais eficiente e acessível. Este projeto visa ser uma versão aprimorada de plataformas existentes, como o aplicativo "Sympla", oferecendo recursos adicionais para facilitar a contratação de artistas e a organização de eventos.


O principal objetivo do projeto é criar uma plataforma digital que funcione como uma ponte entre artistas e empresas de eventos (casas de shows, organizadores, festivais, etc.). A plataforma permitirá que os artistas se apresentem de forma acessível para possíveis contratantes, enquanto as casas de shows e outros organizadores de eventos possam encontrar e contratar artistas adequados de maneira mais prática.


Atualmente, plataformas como o "Sympla" oferecem funcionalidades que permitem a compra de ingressos para eventos, mas não focam diretamente na contratação de artistas para shows. A carência de uma ferramenta especializada para essa conexão direta e eficiente foi o que motivou a criação deste projeto. A ideia é suprir essa lacuna no mercado e oferecer uma experiência mais personalizada tanto para artistas quanto para organizadores de eventos, trazendo benefícios como:


## Tecnologias

* Node.js com Express para gerenciar as requisições e autenticação dos usuários.
* SQLite para armazenar informações sobre artistas, casas de shows e eventos.

A interface foi pensada para ser intuitiva e de fácil navegação, com layouts dinâmicos e opções de filtro para facilitar a busca por artistas e eventos.

## Funcionalidades do Sistema

1. **Cadastro de Usuários**: Registro de artistas e organizadores com validação de dados
2. **Login Seguro**: Autenticação com JWT (JSON Web Tokens)
3. **Middleware de Proteção**: Rotas protegidas que exigem autenticação
4. **Logout**: Encerramento seguro de sessão
5. **Criação de Perfil de Artistas**: Cadastro completo com informações pessoais e profissionais
6. **Portfólio Musical**: Upload e gerenciamento de músicas, fotos e vídeos
7. **Definição de Preços**: Configuração de valores para diferentes tipos de apresentações
8. **Gêneros Musicais**: Seleção e categorização por estilos musicais
9. **Disponibilidade**: Calendário de datas disponíveis para shows
10. **Sistema de Avaliações**: Recebimento e exibição de avaliações de organizadores
11. **Cadastro Empresarial**: Registro de casas de shows, produtoras e organizadores
12. **Informações de Contato**: Telefone, email e site para comunicação
13. **Tipos de Eventos**: Especificação dos tipos de eventos que organizam
14. **Capacidade Máxima**: Definição da capacidade dos locais de eventos
15. **Histórico de Eventos**: Registro de eventos anteriores organizados
16. **Busca por Nome**: Localização de artistas pelo nome ou nome artístico
17. **Filtro por Gênero**: Busca de artistas por estilo musical específico
18. **Filtro por Preço**: Busca dentro de faixas de preço estabelecidas
19. **Filtro por Avaliação**: Ordenação por classificação dos artistas
20. **Busca Avançada**: Combinação de múltiplos critérios de busca
21. **Criação de Eventos**: Cadastro de novos eventos com detalhes completos
22. **Edição de Eventos**: Modificação de informações de eventos existentes
23. **Publicação de Eventos**: Divulgação de eventos para artistas
24. **Eventos Simples**: Criação de eventos únicos e independentes
25. **Festivais Compostos**: Criação de eventos com múltiplas apresentações
26. **Calendário de Eventos**: Visualização cronológica de eventos
27. **Candidatura a Eventos**: Artistas podem se candidatar a eventos publicados
28. **Gerenciamento de Candidaturas**: Organizadores visualizam e gerenciam candidaturas
29. **Status de Candidaturas**: Acompanhamento do status (pendente, aceita, rejeitada)
30. **Histórico de Candidaturas**: Registro completo de todas as candidaturas
31. **Geração de Contratos**: Criação automática de contratos após aceitação
32. **Gerenciamento de Contratos**: Visualização e controle de contratos ativos
33. **Status de Contratos**: Acompanhamento (pendente, confirmado, finalizado)
34. **Filtros de Contratos**: Organização por status e data
35. **Histórico Contratual**: Registro de todos os contratos realizados
36. **Notificações por Email**: Envio automático de emails para eventos importantes
37. **Notificações SMS**: Alertas via mensagem de texto
38. **Notificações de Novos Eventos**: Alertas quando novos eventos são publicados
39. **Notificações de Candidaturas**: Avisos sobre novas candidaturas recebidas
40. **Notificações de Contratos**: Alertas sobre mudanças de status em contratos
41. **Artistas Premium**: Perfis destacados com recursos adicionais
42. **Artistas Verificados**: Selo de verificação para artistas autenticados
43. **Destaque em Buscas**: Posicionamento privilegiado nos resultados
44. **Recursos Exclusivos**: Acesso a funcionalidades especiais
45. **Dashboard do Artista**: Visão geral de candidaturas, contratos e perfil
46. **Dashboard do Organizador**: Controle de eventos, candidaturas e contratos
47. **Estatísticas**: Métricas de desempenho e engajamento
48. **Relatórios**: Geração de relatórios de atividades
49. **Strategy Pattern**: Diferentes estratégias de busca (por nome, gênero)
50. **Decorator Pattern**: Decoração de perfis com funcionalidades premium
51. **Composite Pattern**: Estrutura hierárquica para eventos e festivais
52. **Observer Pattern**: Sistema de notificações automáticas
53. **Validação de Dados**: Verificação de integridade dos dados inseridos
54. **Proteção CSRF**: Prevenção contra ataques Cross-Site Request Forgery
55. **Sanitização de Inputs**: Limpeza de dados para prevenir XSS
56. **Criptografia de Senhas**: Hash seguro das senhas dos usuários

O projeto visa atingir um público diversificado, com a expectativa de melhorar a experiência de contratação de artistas e organizar eventos de forma mais eficiente. Espera-se que a plataforma consiga:

> O desenvolvimento deste projeto representa um avanço significativo no mercado de contratação de artistas e organização de eventos. A plataforma proposta não só visa melhorar a visibilidade dos artistas e facilitar a contratação, mas também oferecer uma experiência única tanto para artistas quanto para organizadores de eventos. Com a implementação de funcionalidades inovadoras e uma interface amigável, espera-se que o projeto seja uma solução eficiente e acessível para as necessidades desse segmento.

## Arquitetura do Sistema

### Padrões de Design Utilizados
- **Strategy**: Implementação de diferentes estratégias de busca
- **Decorator**: Adição de funcionalidades premium aos perfis
- **Composite**: Estrutura hierárquica para eventos compostos
- **Observer**: Sistema de notificações automáticas

### Estrutura do Banco de Dados
- **Usuários**: Artistas e organizadores com autenticação
- **Eventos**: Informações completas de eventos e festivais
- **Candidaturas**: Relacionamento entre artistas e eventos
- **Contratos**: Gestão de acordos entre partes

## Como rodar
1. Instalar o Node e NPM
2. npm install
3. npm run dev
4. abrir o index.html no navegador
