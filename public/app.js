import { micromark } from "https://esm.sh/micromark@3?bundle";

const chat = document.querySelector("#chat");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const submit = document.querySelector("#submit");

function addBubble(text, type, toolsUsed = []) {
  const div = document.createElement("div");
  div.className = `bubble ${type}`;
  div.innerHTML = micromark(text);

  // [LD1,3,5 expert] tag per gebruikte tool
  if (toolsUsed.length > 0) {
    const tags = document.createElement("div");
    tags.className = "tools";
    for (const name of toolsUsed) {
      const tag = document.createElement("span");
      tag.className = "badge";
      tag.textContent = `🔧 ${name}`;
      tags.appendChild(tag);
    }
    div.appendChild(tags);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// [LD1,3,5 op niveau] vraag naar de agent sturen
async function sendMessage(prompt) {
  if (!prompt.trim()) return;
  input.value = "";
  addBubble(prompt, "user");
  submit.disabled = true;

  try {
    const response = await fetch("api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    addBubble(data.message, "ai", data.toolsUsed);
  } catch (error) {
    console.error(error);
    addBubble("Kan de server niet bereiken.", "ai");
  } finally {
    submit.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

addBubble("Welkom bij **Overwatch Command**! Vraag me alles over het verhaal en de helden van Overwatch. Ik zoek in onze documenten, kan het laatste nieuws opzoeken en een held voor je kiezen.", "ai");
