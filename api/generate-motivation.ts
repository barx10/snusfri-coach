// Serverless API for generating daily motivation using an AI provider (Google Gemini / GenAI)
// This file runs on the server (Vercel functions). Keep your GEMINI_API_KEY in Vercel's Environment Variables.

import type { VercelRequest, VercelResponse } from '@vercel/node';

type MotivationData = {
  goalReminder: string;
  quoteOrFact: string;
  brutalMotivation: string;
};

const SAFE_FALLBACK = (daysFree: number, moneySaved: number): MotivationData => ({
  goalReminder: `Du har vært snusfri i ${daysFree} dager. Fortsett — målet ditt nærmer seg!`,
  quoteOrFact: `Hver dag uten snus bygger en ny vane. Du gjør en viktig jobb for helsen din.`,
  brutalMotivation: `Du har spart ${moneySaved} kr. Tenk deg hva det kan bli om ett år!`
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed — use POST' });
  }

  try {
    const { daysFree, moneySaved } = req.body ?? {};
    const days = Number(daysFree || 0);
    const money = Number(moneySaved || 0);

    if (Number.isNaN(days) || Number.isNaN(money)) {
      return res.status(400).json({ error: 'Invalid request — daysFree and moneySaved must be numbers' });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!API_KEY) {
      // No API key configured — return a safety fallback so the frontend still works
      console.warn('No GEMINI_API_KEY configured in environment — returning fallback motivation');
      return res.json(SAFE_FALLBACK(days, money));
    }

    // --- EXAMPLE: Call your AI provider here ---
    // The exact request body/endpoint depends on the provider and SDK.
    // Below is a generic fetch example you can adapt to Google Generative Language / Gemini.

    const prompt = `Skriv tre korte motivasjonstekster for en person som har vært snusfri i ${days} dager og har spart ${money} kr. ` +
      `Gi en kraftig 'brutalMotivation' linje (kort) i tillegg til en hyggelig quote/fact og en goalReminder som nevner motorsykkelmål.`;

    // NOTE: The URL and JSON schema below is a placeholder. Replace with the correct GenAI endpoint or SDK
    // Example REST request for a Google Gen AI endpoint might look different — use the official SDK or REST API.
    const GENAI_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/text-bison-001:generate';

    try {
      const r = await fetch(GENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          // The actual payload shape will depend on the API you call. This is an example.
          prompt: prompt,
          // Add other fields such as temperature / maxOutputTokens / safetySettings here
        })
      });

      if (!r.ok) {
        console.error('AI provider returned non-OK status', r.status, await r.text());
        // Fall back to safe data if provider fails
        return res.json(SAFE_FALLBACK(days, money));
      }

      const json = await r.json();

      // Try to extract a text output from a few common shapes.
      let rawText = '';

      if (typeof json?.candidates?.[0]?.output === 'string') rawText = json.candidates[0].output;
      else if (typeof json?.candidates?.[0]?.content === 'string') rawText = json.candidates[0].content;
      else if (typeof json?.output === 'string') rawText = json.output;
      else if (typeof json?.choices?.[0]?.message?.content === 'string') rawText = json.choices[0].message.content;
      else rawText = JSON.stringify(json);

      // Simple, resilient parsing from provider text into fields — expect a short plain-text response
      // We attempt to split into 3 parts; if parsing fails we still return the fallback
      const parts = rawText.split('\n').map(p => p.trim()).filter(Boolean);

      const result: MotivationData = {
        goalReminder: parts[0] ?? SAFE_FALLBACK(days, money).goalReminder,
        quoteOrFact: parts[1] ?? SAFE_FALLBACK(days, money).quoteOrFact,
        brutalMotivation: parts[2] ?? SAFE_FALLBACK(days, money).brutalMotivation,
      };

      return res.json(result);
    } catch (err) {
      console.error('Error while calling AI provider:', err);
      return res.json(SAFE_FALLBACK(days, money));
    }

  } catch (error) {
    console.error('Error in /api/generate-motivation:', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
