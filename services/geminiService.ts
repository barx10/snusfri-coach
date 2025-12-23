import { GoogleGenAI, Type } from "@google/genai";
import type { MotivationData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const motivationSchema = {
    type: Type.OBJECT,
    properties: {
        goalReminder: {
            type: Type.STRING,
            description: "En kort, motiverende setning som minner brukeren på motorsykkelmålet. Varier formuleringen hver dag."
        },
        quoteOrFact: {
            type: Type.STRING,
            description: "Et unikt og interessant sitat eller fakta om frihet, styrke, motorer eller det å overvinne en utfordring. Unngå klisjeer."
        },
        brutalMotivation: {
            type: Type.STRING,
            description: "En brutalt ærlig og direkte motivasjon. Koble pengene spart til konkrete ting brukeren kan kjøpe, gjerne deler til en motorsykkel, eller en annen hardtslående kommentar. Eksempel: 'Du har spart X kr. Det er en ny hjelm. Fortsett.'"
        }
    },
    required: ["goalReminder", "quoteOrFact", "brutalMotivation"]
};

export const getDailyMotivation = async (daysFree: number, moneySaved: number, savingsGoal: string = "en ny motorsykkel"): Promise<MotivationData> => {
    try {
        const prompt = `Jeg har vært snusfri i ${daysFree} dager og spart ${moneySaved} kr. Målet er ${savingsGoal}. Gi meg dagens motivasjon:
1. En kort påminnelse om målet (${savingsGoal}).
2. Et unikt sitat eller fakta (frihet, styrke, utholdenhet).
3. En brutalt ærlig motivasjon som bruker den sparte summen til å beskrive en konkret belønning eller fremgang mot målet.
Vær kreativ og unngå klisjeer.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: "Du er en brutalt ærlig og direkte motivasjonscoach fra Norge. Du hjelper en bruker med å slutte å snuse. Tonen din er rå, no bullshit og ikke bruke klisjeer. Svarene dine skal være korte og konsise.",
                responseMimeType: "application/json",
                responseSchema: motivationSchema,
                temperature: 0.9, 
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        return data as MotivationData;

    } catch (error) {
        console.error("Error fetching daily motivation:", error);
        // Return a fallback motivation in case of an API error
        return {
            goalReminder: `Hver krone spart er en del av ${savingsGoal}.`,
            quoteOrFact: "Feil er bare bevis på at du prøver. Stå på!",
            brutalMotivation: "Du har spart nok til en kaffe og en vaffel. Det er en start. Ikke gi deg."
        };
    }
};

export const getPanicRoast = async (daysFree: number): Promise<string> => {
    try {
        // Add randomness to the prompt to prevent caching and ensure variety
        const randomSeed = Math.floor(Math.random() * 10000);
        const prompt = `JEG HOLDER PÅ Å SPREKKE! Jeg har vært snusfri i ${daysFree} dager.
Gi meg en ekstremt brutal, sarkastisk, nådeløs og "mean" roast som får meg til å føle meg som en total idiot hvis jeg tar en snus nå.
Ikke hold igjen. Bruk mørk humor, vær personlig (du vet kun at jeg har klart ${daysFree} dager), og få meg til å skamme meg over at jeg i det hele tatt vurderer det.
Svaret skal være ren tekst, ingen JSON. Maks 3 setninger.
Random seed: ${randomSeed}`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: "Du er en slem, sarkastisk og nådeløs anti-snus demon. Din jobb er å skremme eller skamme brukeren fra å snuse.",
                temperature: 1.2, // Increased temperature for more variety
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error fetching panic roast:", error);
        
        // Fallback roasts if API fails
        const fallbacks = [
            "Seriøst? Etter all den jobben? Skjerp deg, din svake jævel. Ikke rør den boksen.",
            "Du har klart deg så lenge, og nå skal du kaste bort alt for 5 minutter med nikotin? Patetisk.",
            "Tenk på motorsykkelen. Tenk på pengene. Tenk på hvor dum du ser ut med snus under leppa.",
            "Er du en mann eller en mus? Legg fra deg boksen og gå og ta deg en bolle.",
            "Hjernen din lurer deg. Du trenger det ikke. Du er bare svak akkurat nå. Stram deg opp!"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
};