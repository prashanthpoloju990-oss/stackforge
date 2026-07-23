export async function callOpenRouterAI(messages: { role: string; content: string }[], options: { maxTokens?: number } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API Key is not configured in environment.");
  }

  // Model fallback chain for maximum reliability
  const candidateModels = [
    "google/gemini-2.0-flash-001",
    "openai/gpt-4o-mini",
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat"
  ];

  let lastError = "";

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://stackforge.co.in",
          "X-Title": "StackForge",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: options.maxTokens || 2500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const completion = await response.json();
        const content = completion.choices?.[0]?.message?.content || "";
        if (content) {
          return content;
        }
      } else {
        const errText = await response.text();
        console.warn(`[OPENROUTER] Model ${model} returned ${response.status}: ${errText}`);
        lastError = `Model ${model} error (${response.status}): ${errText}`;
      }
    } catch (err: any) {
      console.warn(`[OPENROUTER] Model ${model} fetch exception:`, err);
      lastError = err.message || String(err);
    }
  }

  throw new Error(lastError || "All OpenRouter candidate models failed to return a response.");
}

export function parseJsonFromAiText(text: string): any {
  if (!text) return null;
  let cleaned = text.trim();
  
  // Remove markdown code fence blocks if present
  if (cleaned.includes("```")) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    } else {
      cleaned = cleaned.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/g, "").trim();
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (firstErr) {
    // Attempt extracting the first JSON object block {...}
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (secondErr) {
        console.error("[PARSE-JSON-AI] Failed parsing extracted JSON block:", jsonMatch[0]);
      }
    }
    throw firstErr;
  }
}
