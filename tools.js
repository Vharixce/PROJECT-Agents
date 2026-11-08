import { tool } from "@langchain/core/tools";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await FaissStore.load("./documents", embeddings);
console.log("vector store loaded!");

// [LD1,3,5 gevorderd] meerdere tools die bij de use case passen

// (additionalProperties: false is verplicht bij de OpenAI api)
// [LD1,4,5 op niveau] agent zoekt info in de vectordatabase
export const retrieve = tool(
  async ({ query }) => {
    console.log(`retrieve: "${query}"`);
    const relevantDocs = await vectorStore.similaritySearch(query, 3);

    // [LD1,4,5 gevorderd] checken uit welk document het komt
    for (const doc of relevantDocs) {
      console.log(`  gevonden in: ${doc.metadata.source}`);
    }

    return relevantDocs.map((doc) => doc.pageContent).join("\n\n");
  },
  {
    name: "retrieve",
    description: "Zoek in de Overwatch-lore documenten naar info over het verhaal, de helden, Overwatch, Talon, Blackwatch, de Omnic Crisis en de locaties.",
    schema: {
      type: "object",
      properties: { query: { type: "string", description: "Waar je naar zoekt" } },
      required: ["query"],
      additionalProperties: false
    }
  }
);

// [LD1,3,5 op niveau] tool met key uit de .env (TAVILY_API_KEY)
export const searchWeb = tool(
  async ({ query }) => {
    console.log(`search_web: "${query}"`);
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`
        },
        body: JSON.stringify({ query, max_results: 3, include_answer: true })
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("  tavily fout:", data);
        return "Zoeken op internet is niet gelukt.";
      }
      const results = data.results.map((r) => `${r.title}: ${r.content}`).join("\n\n");
      return `${data.answer ?? ""}\n\n${results}`;
    } catch (error) {
      console.log("  tavily niet bereikbaar:", error.message);
      return "Zoeken op internet is niet gelukt.";
    }
  },
  {
    name: "search_web",
    description: "Zoek op internet naar recent Overwatch nieuws zoals nieuwe helden, seizoenen en updates. Alleen voor actuele info die niet in de documenten staat.",
    schema: {
      type: "object",
      properties: { query: { type: "string", description: "Zoekopdracht, bv. 'Overwatch 2 nieuwe held'" } },
      required: ["query"],
      additionalProperties: false
    }
  }
);

// [LD1,3,5 beginner] simpele tool, zoals de dobbelsteen uit de les
const HEROES = {
  tank: ["Reinhardt", "Winston", "D.Va", "Orisa", "Roadhog", "Sigma", "Zarya", "Ramattra", "Mauga", "Junker Queen", "Doomfist"],
  damage: ["Soldier: 76", "Tracer", "Genji", "Hanzo", "Reaper", "Widowmaker", "Pharah", "Cassidy", "Sombra", "Mei", "Sojourn", "Ashe", "Bastion"],
  support: ["Mercy", "Ana", "Lúcio", "Moira", "Zenyatta", "Brigitte", "Kiriko", "Lifeweaver", "Illari", "Baptiste"]
};

export const randomHero = tool(
  ({ role }) => {
    const pool = HEROES[role] ?? [...HEROES.tank, ...HEROES.damage, ...HEROES.support];
    const hero = pool[Math.floor(Math.random() * pool.length)];
    console.log(`random_hero: ${role} -> ${hero}`);
    return `De willekeurig gekozen held is ${hero}.`;
  },
  {
    name: "random_hero",
    description: "Kies een willekeurige Overwatch held om mee te spelen, eventueel binnen een rol.",
    schema: {
      type: "object",
      properties: {
        role: { type: "string", enum: ["tank", "damage", "support", "alle"], description: "Rol van de held, of 'alle'" }
      },
      required: ["role"],
      additionalProperties: false
    }
  }
);
