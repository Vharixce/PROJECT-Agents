import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";
import { retrieve, searchWeb, randomHero } from "./tools.js";

// [LD1,3,5 gevorderd] checkpointer memory
const checkpointer = new MemorySaver();

const model = new ChatOpenAI({ model: "gpt-4.1-mini", temperature: 0.3 });

const AgentResponse = z.object({
  message: z.string().describe("Het antwoord aan de gebruiker"),
  toolsUsed: z.array(z.string()).describe("Namen van de tools die je voor dit antwoord gebruikt hebt, zonder het woord functions")
});

// [LD1,3,5 op niveau] system prompt legt de tools uit
const systemPrompt = `Je bent "Overwatch Command", de vriendelijke helpdesk-agent van een Overwatch fansite.
Je helpt spelers met vragen over Overwatch: het verhaal (de lore), de helden, Overwatch, Talon, Blackwatch, de Omnic Crisis en de locaties.

Je tools:
- retrieve: zoekt in onze eigen Overwatch-lore documenten. Gebruik deze ALTIJD bij vragen over het verhaal, helden, organisaties, locaties en gebeurtenissen.
- search_web: zoekt op internet. Alleen voor actueel nieuws (nieuwe helden, seizoenen, events, updates).
- random_hero: kiest een willekeurige held, als de speler niet weet met wie hij moet spelen.

Regels:
- Baseer je antwoord op wat de tools teruggeven. Staat het er niet in, zeg dat dan eerlijk. Verzin niets.
- Je helpt alleen met Overwatch. Andere vragen weiger je vriendelijk, zonder tools te gebruiken.
- Antwoord in het Nederlands, kort (max 5 zinnen), met af en toe een knipoog naar de game.`;

// [LD1,3,5 beginner] agent met tools
const agent = createAgent({
  model,
  tools: [retrieve, searchWeb, randomHero],
  checkpointer,
  responseFormat: AgentResponse,
  systemPrompt
});

export async function callAgent(prompt) {
  try {
    const result = await agent.invoke(
      { messages: [{ role: "user", content: prompt }] },
      { configurable: { thread_id: "1" } }
    );

    // [LD1,3,5 gevorderd] checken welke tools echt zijn aangeroepen bij deze vraag
    // (extract is geen echte tool, zo maakt langchain de structured output)
    const vraag = result.messages.findLastIndex((m) => m.getType() === "human");
    const toolsCalled = result.messages
      .slice(vraag)
      .filter((m) => m.getType() === "tool" && !m.name.startsWith("extract"))
      .map((m) => m.name);

    console.log("agent zegt:", result.structuredResponse.toolsUsed);
    console.log("echt gebruikt:", toolsCalled);

    // [LD1,3,5 expert] gebruikte tools gaan mee naar de frontend
    return { message: result.structuredResponse.message, toolsUsed: toolsCalled };
  } catch (error) {
    console.error(error);
    return { message: "Sorry, de agent is even niet beschikbaar.", toolsUsed: [] };
  }
}
