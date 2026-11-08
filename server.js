import express from "express";
import { callAgent } from "./agent.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// [LD1,3,5 op niveau] agent aanroepen vanuit de frontend
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  console.log(`\nvraag: ${prompt}`);
  const response = await callAgent(prompt);
  res.json(response);
});

app.listen(3000, () => console.log("Serving on http://localhost:3000"));
