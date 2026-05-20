import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const FALLBACKS = [
    'Seriøst? Etter all den jobben? Skjerp deg, din svake jævel. Ikke rør den boksen.',
    'Du har klart deg så lenge, og nå skal du kaste bort alt for 5 minutter med nikotin? Patetisk.',
    'Tenk på motorsykkelen. Tenk på pengene. Tenk på hvor dum du ser ut med snus under leppa.',
    'Er du en mann eller en mus? Legg fra deg boksen og gå og ta deg en bolle.',
    'Hjernen din lurer deg. Du trenger det ikke. Du er bare svak akkurat nå. Stram deg opp!',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { daysFree, apiKey } = req.body ?? {};
    const days = Number(daysFree || 0);
    const API_KEY = (typeof apiKey === 'string' && apiKey) || process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!API_KEY) {
        return res.json({ roast: FALLBACKS[days % FALLBACKS.length] });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const randomSeed = Math.floor(Math.random() * 10000);
        const prompt = `JEG HOLDER PÅ Å SPREKKE! Jeg har vært snusfri i ${days} dager.
Gi meg en ekstremt brutal, sarkastisk, nådeløs og "mean" roast som får meg til å føle meg som en total idiot hvis jeg tar en snus nå.
Ikke hold igjen. Bruk mørk humor, vær personlig (du vet kun at jeg har klart ${days} dager), og få meg til å skamme meg over at jeg i det hele tatt vurderer det.
Svaret skal være ren tekst, ingen JSON. Maks 3 setninger.
Random seed: ${randomSeed}`;

        const model = process.env.GENAI_MODEL || 'gemini-2.5-flash';
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction: 'Du er en slem, sarkastisk og nådeløs anti-snus demon. Din jobb er å skremme eller skamme brukeren fra å snuse.',
                temperature: 1.2,
            },
        });

        const roast = (response as any)?.text?.trim() ?? FALLBACKS[days % FALLBACKS.length];
        return res.json({ roast });
    } catch (err) {
        console.error('Error in /api/panic-roast:', err);
        return res.json({ roast: FALLBACKS[days % FALLBACKS.length] });
    }
}
