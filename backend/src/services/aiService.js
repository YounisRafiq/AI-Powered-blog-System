const Groq = require("groq-sdk");

const getResponseFromGroq = async (prompt) => {

  if (!prompt || prompt.trim() === "") {
    throw new Error("Prompt is required for AI generation");
  }

  const groq = new Groq({ apiKey: process.env.GROK_API_KEY });

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: String(prompt) }
    ]
  });

  return response.choices[0].message.content;
};

module.exports ={ getResponseFromGroq};