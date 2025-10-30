# Padrões de Projeto Implementados

## 1. Strategy Pattern
**Localização:** `patterns/strategy/`

**Propósito:** Permite diferentes estratégias de busca de artistas.

**Implementação:**
- `SearchStrategy.js` - Interface base
- `GenreSearchStrategy.js` - Busca por gênero
- `NameSearchStrategy.js` - Busca por nome
- `SearchContext.js` - Contexto que usa as estratégias

**Uso:** 
```javascript
const artistaService = new ArtistaService();
const artistas = await artistaService.buscarArtistas({ nome: "João" });
```

## 2. Decorator Pattern
**Localização:** `patterns/decorator/`

**Propósito:** Adiciona funcionalidades extras aos artistas (premium, verificado).

**Implementação:**
- `ArtistaDecorator.js` - Decorator base
- `PremiumArtistaDecorator.js` - Adiciona status premium
- `VerifiedArtistaDecorator.js` - Adiciona verificação

**Uso:**
```javascript
const artistaService = new ArtistaService();
const artistaDecorado = artistaService.decorateArtista(artista, { premium: true, verified: true });
```

## 3. Composite Pattern
**Localização:** `patterns/composite/`

**Propósito:** Permite criar estruturas hierárquicas de eventos (festivais com múltiplos eventos).

**Implementação:**
- `EventComponent.js` - Interface base
- `SimpleEvent.js` - Evento simples (folha)
- `Festival.js` - Festival que contém eventos (composite)

**Uso:**
```javascript
const eventoService = new EventoService();
const festival = await eventoService.criarFestival("Rock Festival", eventos);
```

## Endpoints Disponíveis

### Artistas com Strategy e Decorator:
- `GET /api/artistas/buscar?nome=João` - Busca por nome
- `GET /api/artistas/buscar?genero=1` - Busca por gênero
- `GET /api/artistas/decorados` - Lista artistas com decorações

### Eventos com Composite:
- `POST /api/eventos/festival` - Cria festival com múltiplos eventos

## 4. Observer Pattern
**Localização:** `patterns/observer/`

**Propósito:** Envia notificações automáticas quando eventos importantes acontecem.

**Implementação:**
- `Observer.js` - Interface base
- `Subject.js` - Gerencia observadores
- `EmailNotifier.js` - Notificações por email
- `SMSNotifier.js` - Notificações por SMS
- `NotificationManager.js` - Coordena notificações

**Uso:**
```javascript
const notificationService = new NotificationService();
notificationService.notifyNewEvent(evento, organizador);
```

### Notificações Automáticas:
- Criação de eventos
- Novas candidaturas
- Candidaturas aceitas