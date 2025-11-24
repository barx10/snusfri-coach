// Serverless API for generating daily motivation using an AI provider (Google Gemini / GenAI)
// This file runs on the server (Vercel functions). Keep your GEMINI_API_KEY in Vercel's Environment Variables.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

type MotivationData = {
  goalReminder: string;
  quoteOrFact: string;
  brutalMotivation: string;
};

const SAFE_FALLBACK = (daysFree: number, moneySaved: number): MotivationData => {
  // Local fallback variants so the app still feels dynamic even without an API key.
  const dayIndex = (daysFree || 0);

  const goalReminderVariants = [
    `Du har vært snusfri i ${daysFree} dager. Fortsett — målet ditt nærmer seg!`,
    `Dag ${daysFree}: hver dag er et skritt nærmere motorsykkelen. Stå på!`,
    `Flott jobbet — ${daysFree} dager uten snus. Ikke stopp nå, du er nærmere enn du tror.`,
    `Hold tempoet! ${daysFree} dager viser at du har disiplin. Motorsykkelen venter.`,
    `Hver dag teller. ${daysFree} dager er bevis på at du kan klare dette.`
  ];

  const quoteOrFactVariants = [
    `Hver dag uten snus bygger en ny vane. Du gjør en viktig jobb for helsen din.`,
    `Visste du: kroppen starter å reparere seg kort tid etter at du slutter. Hold kursen.`,
    `Enkle endringer hver dag fører til stor forandring over tid. Bra jobbet.`,
    `Små seire hver dag blir til store gevinster. Ikke undervurder det.`,
    `Disiplinen du bygger i dag, betaler seg i morgen.`
  ];

  // Brutal, hard, mocking variants (user requested harsh tone for 'spark i ræva')
  const brutalVariants = [
    `Dagens spark i ræva: Du er svekkelse i praksis — slutt å gi etter for snusbegjær!`,
    `Skjerp deg. Dette er ikke et ønske; det er et valg. Gå ut av komfortsonen og gjør det nå.`,
    `Så svakt.  ${daysFree} dager burde vært mye lengre — ikke la deg lure av gamle vaner.`,
    `Null unnskyldninger. Du er bedre enn den lille stemmen som sier 'bare én til'. Bank den ned.`,
    `Ikke forvent belønning for slapphet. Reis deg og vis hvem som bestemmer — du eller snusen?`
  ];

  const choose = (arr: string[]) => arr.length ? arr[dayIndex % arr.length] : '';

  return {
    goalReminder: choose(goalReminderVariants),
    quoteOrFact: choose(quoteOrFactVariants),
    brutalMotivation: choose(brutalVariants).replace('${moneySaved}', String(moneySaved))
  };
};
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

    // Ask for structured JSON with multiple variants for each field (we'll pick one deterministically by day)
    const prompt = `Du er en motivator. Lag en JSON med tre arrays: ` +
      `"goalReminderVariants", "quoteOrFactVariants" og "brutalMotivationVariants". ` +
      `Hver array skal inneholde 5 korte varianter (maks 140 tegn hver). ` +
      `Krav til tone: brutalMotivation må være HÅRD, NÅDELØS, BRUTAL og litt HÅNENDE (kort, slagkraftig). ` +
      `goalReminder skal være motiverende og oppmuntrende. ` +
      `quoteOrFact kan være en kort fakta eller sitat som inspirerer. ` +
      `Svar kun med gyldig JSON uten ekstra tekst.` +
      ` Kontekst: personen har vært snusfri i ${days} dager og har spart ${money} kr.`;

    // NOTE: The URL and JSON schema below is a placeholder. Replace with the correct GenAI endpoint or SDK
    // Example REST request for a Google Gen AI endpoint might look different — use the official SDK or REST API.
    const GENAI_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/text-bison-001:generate';

    try {
      // Use @google/genai SDK to call Gemini and request structured JSON output.
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      const model = process.env.GENAI_MODEL || 'gemini-2.5-flash';
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { temperature: 0.8, maxOutputTokens: 256 }
      });

      // The SDK usually returns the model text in `response.text`.
      const rawText = (response as any)?.text ?? JSON.stringify(response);

      // We expect rawText to be JSON (as instructed). Try to parse it.
      let parsed: any = null;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        // If parsing fails, try to extract JSON substring
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          try {
            parsed = JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
          } catch (err2) {
            parsed = null;
          }
        }
      }

      // If parsed is valid and contains arrays use them, otherwise fall back
      const chooseVariant = (arr: any[] | undefined, defaultVal: string) => {
        if (!Array.isArray(arr) || arr.length === 0) return defaultVal;
        const idx = days % arr.length;
        return String(arr[idx]);
      };

      if (parsed && (Array.isArray(parsed.goalReminderVariants) || Array.isArray(parsed.quoteOrFactVariants) || Array.isArray(parsed.brutalMotivationVariants))) {
        const g = chooseVariant(parsed.goalReminderVariants, SAFE_FALLBACK(days, money).goalReminder);
        const q = chooseVariant(parsed.quoteOrFactVariants, SAFE_FALLBACK(days, money).quoteOrFact);
        const b = chooseVariant(parsed.brutalMotivationVariants, SAFE_FALLBACK(days, money).brutalMotivation);

        return res.json({ goalReminder: g, quoteOrFact: q, brutalMotivation: b });
      }

      // Last chance: if provider returned plain text but not JSON, fallback to SAFE_FALLBACK
      return res.json(SAFE_FALLBACK(days, money));
    } catch (err) {
      console.error('Error while calling AI provider:', err);
      return res.json(SAFE_FALLBACK(days, money));
    }

  } catch (error) {
    console.error('Error in /api/generate-motivation:', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
