const Anthropic = require("@anthropic-ai/sdk/index.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Groq } = require('groq-sdk');

const buildPrompt = (role, company, jd, categories, difficulty, count) => `
You are an expert technical interviewer at top tech companies.

Generate ${count} interview questions for the following:
- Role: ${role}
- Company: ${company}
- Job Description: ${jd || "Not provided"}
- Categories: ${categories.join(", ")}
- Difficulty: ${difficulty}

Return ONLY a valid JSON object, no extra text, no markdown, no backticks:
{
  "questions": [
    {
      "category": "DSA",
      "question": "question text here",
      "hint": "answer hint here"
    }
  ]
}
`;

// Claude (Primary) 
const tryClauде = async (prompt) => {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text;
  return { data: JSON.parse(text), model: "Claude" };
};

// Gemini (Fallback 1)
const tryGemini = async (prompt) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown fences if present
  const clean = text.replace(/```json|```/g, "").trim();
  return { data: JSON.parse(clean), model: "Gemini" };
};

// ── Groq (Fallback 2) ─────────────────────────────────────────
const tryGroq = async (prompt) => {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return { data: JSON.parse(clean), model: "Groq" };
};

// ── Main fallback chain ───────────────────────────────────────
const generateQuestions = async ({
  role,
  company,
  jd,
  categories,
  difficulty,
  count,
}) => {
  const prompt = buildPrompt(role, company, jd, categories, difficulty, count);

  const providers = [
    { name: "Gemini", fn: tryGemini },
    { name: "Groq", fn: tryGroq },
    { name: "Claude", fn: tryClauде },
  ];

  let lastError;

  for (const provider of providers) {
    try {
      console.log(`🤖 Trying ${provider.name}...`);
      const result = await provider.fn(prompt);
      console.log(`✅ ${provider.name} responded successfully`);
      return result;
    } catch (err) {
      console.error(`❌ ${provider.name} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError.message}`);
};

module.exports = { generateQuestions };
