import type { MotivationData } from '../types';

// This is a template file - replace with your actual API implementation
// To use this app, you need to:
// 1. Create a .env file with your API_KEY
// 2. Implement your preferred AI service here
// 3. Follow the MotivationData interface from types.ts

export const getDailyMotivation = async (daysFree: number, moneySaved: number): Promise<MotivationData> => {
    try {
        // TODO: Implement your AI service call here
        // Example structure:
        // - Use your preferred AI API (OpenAI, Anthropic, Google Gemini, etc.)
        // - Pass daysFree and moneySaved as context
        // - Return motivation data matching the MotivationData interface
        
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
