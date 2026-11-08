# USE CASE AGENT - Overwatch Command

Doel: Welk probleem wil je oplossen met je agent?
Spelers hebben vragen over het verhaal en de helden van Overwatch. Een gewoon taalmodel verzint dan soms dingen en weet niks over nieuwe updates. Mijn agent zoekt in eigen documenten, zoekt actueel nieuws op internet en kan een held voor je kiezen.

Voor wie is deze agent bedoeld?
Overwatch spelers van ongeveer 15-30 jaar met een vraag over de lore, de helden of wat er nieuw is in de game.

Functionaliteit
Welke documenten moet de agent kunnen lezen?
6 eigen txt bestanden over de Overwatch lore (samen ongeveer 5100 woorden, ongeveer 10 pagina's): het verhaal, de tijdlijn, de personages, uitgebreide personages, de locaties en lore details.

Welke tools heeft de agent nodig?
- retrieve: zoekt in de documenten (FAISS vectorstore)
- search_web: zoekt Overwatch nieuws met de Tavily API, key staat in de .env
- random_hero: eigen javascript die een willekeurige held kiest

Gedrag en houding
Welke tone of voice past bij je use case?
Vriendelijk en behulpzaam, zoals een helpdesk van een fansite. Korte antwoorden met af en toe een knipoog naar de game. Eerlijk als hij iets niet weet.

Moet de agent zelf initiatief nemen of enkel reageren?
Hij reageert op vragen, maar kiest zelf welke tool hij gebruikt. Vragen die niet over Overwatch gaan beantwoordt hij niet.

Voelt de agent als een persoonlijkheid?
Ja, hij heeft een naam, een avatar, een welkomstbericht en praat zoals iemand uit de game.

User interface
Heeft de agent een naam en een avatar?
Ja, "Overwatch Command" met een avatar in de header.

Hoe weet de gebruiker welke tools er zijn en of ze gebruikt zijn?
De tools staan in de header en in het welkomstbericht. Onder elk antwoord staat een tag per gebruikte tool, bijvoorbeeld "🔧 retrieve".
