const Groq = require("groq-sdk");

const getResponseFromGroq = async (prompt) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROK_API_KEY
    });

    const response = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt || "write a blog on web development" }
      ],
      model: "llama-3.1-8b-instant",
    });

    return response.choices[0].message.content;

  } catch (error) {
    throw error;
  }
};

module.exports = { getResponseFromGroq };