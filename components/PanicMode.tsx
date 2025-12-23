import React, { useState } from 'react';
import { getPanicRoast } from '../services/geminiService';
import { FireIcon } from './IconComponents';

interface PanicModeProps {
    daysFree: number;
    onClose: () => void;
}

const PanicMode: React.FC<PanicModeProps> = ({ daysFree, onClose }) => {
    const [roast, setRoast] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'menu' | 'roast' | 'zen'>('menu');

    const handleGetRoast = async () => {
        setMode('roast');
        setIsLoading(true);
        const result = await getPanicRoast(daysFree);
        setRoast(result);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-red-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="max-w-lg w-full bg-slate-900 border-2 border-red-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] relative overflow-hidden">
                
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                {mode === 'menu' && (
                    <div className="text-center space-y-8">
                        <div className="animate-pulse">
                            <h2 className="text-4xl font-black text-red-500 uppercase tracking-tighter mb-2">PANIC MODE</h2>
                            <p className="text-slate-300 text-lg">Er du i ferd med å gjøre noe dumt?</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={handleGetRoast}
                                className="group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-red-600/30"
                            >
                                <div className="relative z-10 flex items-center justify-center space-x-3">
                                    <FireIcon className="w-8 h-8" />
                                    <span className="text-xl">ROAST ME 🔥</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button
                                onClick={() => setMode('zen')}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 px-6 rounded-xl transition-colors border border-slate-700"
                            >
                                🧘 Jeg trenger bare å puste litt...
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'roast' && (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-red-500 mb-6 uppercase tracking-widest">Brutal Sannhet</h3>
                        
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500"></div>
                                <p className="text-red-400 animate-pulse">Forbereder verbal juling...</p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <p className="text-xl sm:text-2xl font-bold text-slate-100 leading-relaxed font-mono border-l-4 border-red-500 pl-6 text-left">
                                    "{roast}"
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleGetRoast}
                                        className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-200 font-bold py-3 rounded-xl transition-all border border-red-500/30"
                                    >
                                        Det svir ikke nok. Prøv igjen! 😤
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors"
                                    >
                                        Greit, jeg skjønner tegninga. Jeg fortsetter.
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'zen' && (
                    <div className="text-center py-8">
                        <div className="mb-8 relative">
                            <div className="w-32 h-32 mx-auto bg-sky-500/20 rounded-full animate-ping absolute inset-0 left-1/2 -translate-x-1/2"></div>
                            <div className="w-32 h-32 mx-auto bg-sky-500/40 rounded-full flex items-center justify-center relative z-10 animate-pulse">
                                <span className="text-4xl">🧘</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-sky-400 mb-4">Pust inn... Pust ut...</h3>
                        <p className="text-slate-300 mb-8">Suget varer bare i noen minutter. Du har kontrollen.</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-sky-500/20"
                        >
                            Jeg har roet meg ned
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanicMode;
