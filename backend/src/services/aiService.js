const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function runGemini(title) {

  const prompt =  `
You are a professional SEO blog writer.

Write a high-quality blog post on: "${title}"

Requirements:
- Catchy introduction
- Use headings (H1, H2, H3)
- Add examples
- Use simple English
- Add conclusion
- SEO optimized
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
  });

  
  console.log("Gemini says:", response.text);
}

module.exports = { runGemini };