
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const QUIT_DATE_KEY = 'snusfri_quit_date_v1';

const App: React.FC = () => {
    const [quitDate, setQuitDate] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storedDate = localStorage.getItem(QUIT_DATE_KEY);
            if (storedDate) {
                setQuitDate(JSON.parse(storedDate));
            }
        } catch (error) {
            console.error("Failed to parse quit date from localStorage", error);
            localStorage.removeItem(QUIT_DATE_KEY);
        }
        setIsInitialized(true);
    }, []);

    const handleSetQuitDate = () => {
        const now = Date.now();
        localStorage.setItem(QUIT_DATE_KEY, JSON.stringify(now));
        setQuitDate(now);
    };

    const handleReset = () => {
        if (window.confirm("Er du sikker på at du vil nullstille fremgangen din?")) {
            localStorage.removeItem(QUIT_DATE_KEY);
            setQuitDate(null);
        }
    };

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                {/* Initial loading state can be a spinner */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
            {quitDate ? (
                <Dashboard quitDate={quitDate} onReset={handleReset} />
            ) : (
                <Onboarding onStart={handleSetQuitDate} />
            )}
        </div>
    );
};

export default App;
