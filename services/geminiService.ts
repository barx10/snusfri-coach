import type { MotivationData } from '../types';

export const getDailyMotivation = async (
    daysFree: number,
    moneySaved: number,
    savingsGoal: string = 'en ny motorsykkel',
    apiKey: string = ''
): Promise<MotivationData> => {
    try {
        const res = await fetch('/api/generate-motivation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ daysFree, moneySaved, savingsGoal, apiKey }),
        });
        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch (error) {
        console.error('Error fetching daily motivation:', error);
        return {
            goalReminder: `Hver krone spart er en del av ${savingsGoal}.`,
            quoteOrFact: 'Feil er bare bevis på at du prøver. Stå på!',
            brutalMotivation: 'Du har spart nok til en kaffe og en vaffel. Det er en start. Ikke gi deg.',
        };
    }
};

export const getPanicRoast = async (daysFree: number, apiKey: string = ''): Promise<string> => {
    try {
        const res = await fetch('/api/panic-roast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ daysFree, apiKey }),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return data.roast;
    } catch (error) {
        console.error('Error fetching panic roast:', error);
        const fallbacks = [
            'Seriøst? Etter all den jobben? Skjerp deg, din svake jævel. Ikke rør den boksen.',
            'Du har klart deg så lenge, og nå skal du kaste bort alt for 5 minutter med nikotin? Patetisk.',
            'Tenk på motorsykkelen. Tenk på pengene. Tenk på hvor dum du ser ut med snus under leppa.',
            'Er du en mann eller en mus? Legg fra deg boksen og gå og ta deg en bolle.',
            'Hjernen din lurer deg. Du trenger det ikke. Du er bare svak akkurat nå. Stram deg opp!',
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
};
