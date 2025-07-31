# Snusfri Coach

En motiverende app som hjelper deg å holde deg snusfri med fokus på motorsykkelmål.

## Kjør Lokalt

**Forutsetninger:** Node.js

1. Installer dependencies:
   ```bash
   npm install
   ```

2. Sett opp API-nøkkel:
   - Kopier `.env.example` til `.env`
   - Legg til din API-nøkkel i `.env` filen
   ```bash
   cp .env.example .env
   ```

3. Sett opp AI service:
   - Kopier `services/geminiService.template.ts` til `services/geminiService.ts`
   - Implementer din foretrukne AI service (Google Gemini, OpenAI, etc.)
   ```bash
   cp services/geminiService.template.ts services/geminiService.ts
   ```

4. Kjør appen:
   ```bash
   npm run dev
   ```

## Funksjoner

- 📊 Dashboard med statistikk over snusfrie dager
- 💰 Kalkulering av penger spart
- 🏍️ Motivasjon fokusert på motorsykkelmål
- 🤖 AI-generert daglig motivasjon

## API Oppsett

Denne appen bruker AI for å generere personlig motivasjon. Du trenger å:

1. Velge en AI-tjeneste (Google Gemini, OpenAI, Anthropic, etc.)
2. Få en API-nøkkel
3. Implementere servicen i `services/geminiService.ts`

Template-filen viser hvordan servicen skal struktureres.
