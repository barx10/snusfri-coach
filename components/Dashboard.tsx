import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Use the template service by default in the public repo so build succeeds.
// If you want a custom service, copy `services/geminiService.template.ts` -> `services/geminiService.ts` locally.
import { getDailyMotivation } from '../services/geminiService.template';
import StatCard from './StatCard';
import { MotivationData } from '../types';
import { CalendarIcon, CashIcon, MotorcycleIcon, FireIcon } from './IconComponents';

interface DashboardProps {
    quitDate: number;
    onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
);

const Dashboard: React.FC<DashboardProps> = ({ quitDate, onReset }) => {
    const [motivation, setMotivation] = useState<MotivationData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { daysFree, moneySaved } = useMemo(() => {
        const now = Date.now();
        const diff = now - quitDate;
        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const saved = days * 110;
        return { daysFree: days, moneySaved: saved };
    }, [quitDate]);

    const fetchMotivation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDailyMotivation(daysFree, moneySaved);
            setMotivation(data);
        } catch (err) {
            setError("Kunne ikke hente dagens motivasjon, men du klarer dette! Prøv å laste siden på nytt.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [daysFree, moneySaved]);

    useEffect(() => {
        fetchMotivation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchMotivation]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="flex flex-col flex-grow max-w-2xl mx-auto w-full">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">Din daglige motivasjon</h1>
                <p className="text-slate-400 mt-1">Dag {daysFree}</p>
            </header>

            <main className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

                <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700/50">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400">{error}</div>
                    ) : motivation && (
                        <div className="space-y-6 animate-fade-in">
                             <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    <FireIcon className="w-7 h-7 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-200">Dagens spark i ræva</h3>
                                    <p className="text-slate-300 font-medium">{motivation.brutalMotivation}</p>
                                    <p className="text-slate-400 text-sm italic mt-2">"{motivation.quoteOrFact}"</p>
                                </div>
                            </div>
                            <div className="border-t border-slate-700"></div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    <MotorcycleIcon className="w-7 h-7 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-200">Målet ditt: Motorsykkel</h3>
                                    <p className="text-slate-300">{motivation.goalReminder}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <div className="mt-12 animate-fade-in">
                 <img
                    src="https://images.pexels.com/photos/4616618/pexels-photo-4616618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="En moderne, lys motorsykkel parkert på en gate i sollys"
                    className="w-full h-48 object-cover rounded-xl shadow-lg border border-slate-700/50"
                    aria-label="En moderne, lys motorsykkel parkert på en gate i sollys"
                />
            </div>

            <footer className="text-center mt-8">
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