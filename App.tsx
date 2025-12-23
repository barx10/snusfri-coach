
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserSettings } from './types';

const QUIT_DATE_KEY = 'snusfri_quit_date_v1'; // Old key
const SETTINGS_KEY = 'snusfri_settings_v1'; // New key

const DEFAULT_SETTINGS: UserSettings = {
    quitDate: Date.now(),
    dailyCost: 110,
    savingsGoal: 'Motorsykkel',
    savingsGoalCost: 150000,
    currency: 'NOK'
};

const App: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        try {
            // Check for new settings first
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            } else {
                // Check for old data and migrate
                const storedDate = localStorage.getItem(QUIT_DATE_KEY);
                if (storedDate) {
                    const oldDate = JSON.parse(storedDate);
                    const newSettings = { ...DEFAULT_SETTINGS, quitDate: oldDate };
                    setSettings(newSettings);
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
                    localStorage.removeItem(QUIT_DATE_KEY); // Cleanup old key
                }
            }
        } catch (error) {
            console.error("Failed to parse settings from localStorage", error);
            localStorage.removeItem(SETTINGS_KEY);
        }
        setIsInitialized(true);
    }, []);

    const handleStart = () => {
        const newSettings = { ...DEFAULT_SETTINGS, quitDate: Date.now() };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        setSettings(newSettings);
    };

    const handleUpdateSettings = (newSettings: UserSettings) => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        setSettings(newSettings);
    };

    const handleReset = () => {
        if (window.confirm("Er du sikker på at du vil nullstille fremgangen din?")) {
            localStorage.removeItem(SETTINGS_KEY);
            setSettings(null);
        }
    };

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
            {settings ? (
                <Dashboard 
                    settings={settings} 
                    onUpdateSettings={handleUpdateSettings}
                    onReset={handleReset} 
                />
            ) : (
                <Onboarding onStart={handleStart} />
            )}
        </div>
    );
};

export default App;
