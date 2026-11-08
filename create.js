// npm run create -> maakt de vectorstore (hoeft maar 1x)
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { readdir } from "node:fs/promises";

// [LD1,4,5 gevorderd] meerdere documenten laden
const mapPath = "./public/originals";
const files = (await readdir(mapPath)).filter((f) => f.endsWith(".txt"));
const docs = [];
for (const file of files) {
  const loader = new TextLoader(`${mapPath}/${file}`);
  docs.push(...(await loader.load()));
}
console.log(`${docs.length} documenten geladen`);

// [LD1,4,5 beginner] opsplitsen in chunks
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
const chunks = await textSplitter.splitDocuments(docs);
console.log(`${chunks.length} chunks`);

// [LD1,4,5 beginner] embeddings maken
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// [LD1,4,5 op niveau] opslaan in een vectordatabase
const vectorStore = new FaissStore(embeddings, {});
await vectorStore.addDocuments(chunks);
await vectorStore.save("./documents");
console.log("vector store saved!");
