const axios = require('axios');

async function generateCommitMessage(diff) {
  const openAiApiKey = process.env.OPENAI_API_KEY;
  // console.log("openAiApiKey:", openAiApiKey)

  return "sample commit message"
  // try {
  //   const response = await axios.post("https://api.openai.com/v1/chat/completions", {
  //     model: "gpt-4o",
  //     messages: [{ role: "system", content: "Generate a concise, professional commit message based on the following code changes." },
  //     { role: "user", content: diff }]
  //   }, {
  //     headers: { "Authorization": `Bearer ${openAiApiKey}`, "Content-Type": "application/json" }
  //   });
  //   console.log("response:", response)
  //   return response.data.choices[0].message.content.trim();
  // } catch (error) {
  //   console.error("Error response:", error.response);
  //   console.error("Error message:", error.message);
  // }
}

module.exports = { generateCommitMessage };
