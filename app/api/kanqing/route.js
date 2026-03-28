
import OpenAI from "openai";

export async function POST(req) {
  const { input } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "你是一个结构重构引擎，用单段话回应用户。" },
      { role: "user", content: input }
    ]
  });

  return Response.json({ output: response.choices[0].message.content });
}
