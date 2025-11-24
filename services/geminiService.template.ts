import type { MotivationData } from '../types';

// This is a template file - replace with your actual API implementation
// To use this app, you need to:
// 1. Create a .env file with your API_KEY
// 2. Implement your preferred AI service here
// 3. Follow the MotivationData interface from types.ts

export const getDailyMotivation = async (daysFree: number, moneySaved: number): Promise<MotivationData> => {
    try {
        // Recommended approach when deploying on Vercel (server-side):
        // 1) Add your GEMINI_API_KEY in Vercel's Environment Variables (GEMINI_API_KEY)
        // 2) Use the serverless endpoint /api/generate-motivation (server-side) to keep keys secret
        // Example: call a Vercel serverless function that talks to Google Gemini / GenAI from the server.
        // The repo provides an example serverless handler at /api/generate-motivation.

        // Client-side: simply POST daysFree + moneySaved to the internal API endpoint.
        try {
            const res = await fetch('/api/generate-motivation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ daysFree, moneySaved })
            });

            if (res.ok) {
                const data = await res.json();
                return data as MotivationData;
            } else {
                console.warn('Serverless generation returned non-OK:', await res.text());
            }
        } catch (err) {
            console.error('Error calling serverless generation:', err);
        }
        
        console.warn("API service not configured. Using fallback data.");
        
        // Fallback motivation data
        return {
            goalReminder: `Du har vært snusfri i ${daysFree} dager. Målet ditt venter!`,
            quoteOrFact: "Hver dag uten snus er en dag nærmere friheten.",
            brutalMotivation: `Du har spart ${moneySaved} kr. Det er ${Math.floor(moneySaved / 100)} kaffe-penger mindre til snus-industrien.`
        };

    } catch (error) {
        console.error("Error fetching daily motivation:", error);
        
        // Return a fallback motivation in case of an API error
        return {
            goalReminder: "Hver krone spart er en del av din nye sykkel.",
            quoteOrFact: "Feil er bare bevis på at du prøver. Stå på!",
            brutalMotivation: "Du har spart nok til en kaffe og en vaffel. Det er en start. Ikke gi deg."
        };
    }
};
