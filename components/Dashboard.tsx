import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Use the template service by default in the public repo so build succeeds.
// If you want a custom service, copy `services/geminiService.template.ts` -> `services/geminiService.ts` locally.
import { getDailyMotivation } from '../services/geminiService.template';
import StatCard from './StatCard';
import { MotivationData, UserSettings } from '../types';
import { CalendarIcon, CashIcon, MotorcycleIcon, FireIcon, CogIcon, RefreshIcon } from './IconComponents';
import HealthTimeline from './HealthTimeline';
import Settings from './Settings';

interface DashboardProps {
    settings: UserSettings;
    onUpdateSettings: (settings: UserSettings) => void;
    onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
);

const Dashboard: React.FC<DashboardProps> = ({ settings, onUpdateSettings, onReset }) => {
    const [motivation, setMotivation] = useState<MotivationData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const { daysFree, moneySaved, progressPercentage } = useMemo(() => {
        const now = Date.now();
        const diff = now - settings.quitDate;
        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const saved = days * settings.dailyCost;
        const progress = Math.min(100, (saved / settings.savingsGoalCost) * 100);
        return { daysFree: days, moneySaved: saved, progressPercentage: progress };
    }, [settings]);

    const fetchMotivation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDailyMotivation(daysFree, moneySaved, settings.savingsGoal);
            setMotivation(data);
        } catch (err) {
            setError("Kunne ikke hente dagens motivasjon, men du klarer dette! Prøv å laste siden på nytt.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [daysFree, moneySaved, settings.savingsGoal]);

    useEffect(() => {
        fetchMotivation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchMotivation]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: settings.currency, minimumFractionDigits: 0 }).format(amount);
    };

    const handleSaveSettings = (newSettings: UserSettings) => {
        onUpdateSettings(newSettings);
        setShowSettings(false);
    };

    return (
        <div className="flex flex-col flex-grow max-w-2xl mx-auto w-full relative">
            {showSettings && (
                <Settings 
                    settings={settings} 
                    onSave={handleSaveSettings} 
                    onCancel={() => setShowSettings(false)} 
                />
            )}

            <header className="flex justify-between items-center mb-8">
                <div className="w-8"></div> {/* Spacer for centering */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                        <span className="text-gradient">Din daglige motivasjon</span>
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Dag {daysFree}</p>
                </div>
                <button 
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-slate-400 hover:text-slate-100 transition-colors hover:rotate-90 duration-300"
                    aria-label="Innstillinger"
                >
                    <CogIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-grow space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <StatCard
                        title="Dager snusfri"
                        value={daysFree.toString()}
                        icon={<CalendarIcon className="w-8 h-8 text-sky-400" />}
                    />
                    <StatCard
                        title="Penger spart"
                        value={formatCurrency(moneySaved)}
                        icon={<CashIcon className="w-8 h-8 text-green-400" />}
                    />
                </div>

                {/* Savings Goal Progress */}
                <div className="glass-panel rounded-xl p-6">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sparemål</h3>
                            <p className="text-xl font-bold text-slate-100">{settings.savingsGoal}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-sm font-mono">{progressPercentage.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-4 overflow-hidden border border-slate-700/30">
                        <div 
                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                        <span>0 kr</span>
                        <span>{formatCurrency(settings.savingsGoalCost)}</span>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-6 relative">
                    <button 
                        onClick={fetchMotivation}
                        disabled={isLoading}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50 hover:bg-slate-800/50 rounded-full"
                        aria-label="Hent ny motivasjon"
                    >
                        <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400">{error}</div>
                    ) : motivation && (
                        <div className="space-y-6 animate-fade-in">
                             <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1 p-2 bg-orange-500/10 rounded-lg">
                                    <FireIcon className="w-7 h-7 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-200">Dagens spark i ræva</h3>
                                    <p className="text-slate-300 font-medium leading-relaxed">{motivation.brutalMotivation}</p>
                                    <p className="text-slate-400 text-sm italic mt-3 border-l-2 border-slate-700 pl-3">"{motivation.quoteOrFact}"</p>
                                </div>
                            </div>
                            <div className="border-t border-slate-700/50"></div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1 p-2 bg-amber-500/10 rounded-lg">
                                    <MotorcycleIcon className="w-7 h-7 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-200">Målet ditt: {settings.savingsGoal}</h3>
                                    <p className="text-slate-300 leading-relaxed">{motivation.goalReminder}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <HealthTimeline quitDate={settings.quitDate} />
            </main>

            <footer className="text-center mt-12 mb-8">
                <button
                    onClick={onReset}
                    className="text-slate-500 hover:text-red-400 transition-colors text-sm"
                >
                    Nullstill og start på nytt
                </button>
            </footer>
        </div>
    );
};

export default Dashboard;