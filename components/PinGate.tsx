import React, { useState } from 'react';

interface PinGateProps {
    onAuthenticated: () => void;
}

const PinGate: React.FC<PinGateProps> = ({ onAuthenticated }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });
            if (res.ok) {
                localStorage.setItem('snusfri_auth', 'true');
                onAuthenticated();
            } else {
                setError('Feil kode. Prøv igjen.');
                setPin('');
            }
        } catch {
            setError('Noe gikk galt. Prøv igjen.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="glass-panel rounded-xl p-8 w-full max-w-sm text-center">
                <div className="mb-6">
                    <span className="text-4xl">🏍️</span>
                    <h1 className="text-2xl font-bold text-slate-100 mt-3">Snusfri Coach</h1>
                    <p className="text-slate-400 mt-1 text-sm">Skriv inn tilgangskoden</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 text-center tracking-widest focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all"
                        autoFocus
                        autoComplete="current-password"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading || !pin}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sjekker...' : 'Kom inn'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PinGate;
