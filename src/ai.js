const axios = require('axios');

async function generateCommitMessage(diff) {
  const openAiApiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4",
    messages: [{ role: "system", content: "Generate a concise, professional commit message based on the following code changes." }, 
               { role: "user", content: diff }]
  }, {
    headers: { "Authorization": `Bearer ${openAiApiKey}`, "Content-Type": "application/json" }
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { generateCommitMessage };
