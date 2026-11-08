# Overwatch Command (opdracht 2 Agents)

Helpdesk-agent voor een Overwatch fansite. De agent kiest zelf welke tool hij gebruikt:

- `retrieve` - zoekt in mijn eigen Overwatch documenten (FAISS vectorstore)
- `search_web` - zoekt actueel Overwatch nieuws met de Tavily API
- `random_hero` - kiest een willekeurige held

Onder elk antwoord zie je welke tools gebruikt zijn.

## Installatie

```bash
npm install
```

Maak een `.env` in de projectmap (Tavily key gratis via https://tavily.com):

```
OPENAI_API_KEY=<jouw key>
TAVILY_API_KEY=<jouw tavily key>
```

Vectorstore maken (alleen als de map `documents` er nog niet is of als je documenten aanpast):

```bash
npm run create
```

Starten:

```bash
npm start
```

Open http://localhost:3000

## Bestanden

- `create.js` - documenten laden, splitsen, embedden en opslaan
- `tools.js` - de 3 tools
- `agent.js` - agent met system prompt, memory en structured output
- `server.js` - express server met POST `/api/chat`
- `public/originals/` - 6 documenten over de lore (~5100 woorden)
- `public/app.js` - frontend met tool tags

## AI

Ik heb bij dit project AI gebruikt als hulp.
