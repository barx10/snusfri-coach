import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsProps {
    settings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
    onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onCancel }) => {
    const [formData, setFormData] = useState<UserSettings>(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'dailyCost' || name === 'savingsGoalCost' 
                ? parseFloat(value) 
                : value
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value).getTime();
        setFormData(prev => ({ ...prev, quitDate: date }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Convert timestamp to YYYY-MM-DD for input
    const dateString = new Date(formData.quitDate).toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fade-in">
            <div className="glass-panel rounded-xl p-8 w-full max-w-md relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                    <span className="mr-2">⚙️</span> Innstillinger
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Sluttdato
                        </label>
                        <input
                            type="date"
                            value={dateString}
                            onChange={handleDateChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Daglig kostnad (kr)
                        </label>
                        <input
                            type="number"
                            name="dailyCost"
                            value={formData.dailyCost}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Sparemål (Hva sparer du til?)
                        </label>
                        <input
                            type="text"
                            name="savingsGoal"
                            value={formData.savingsGoal}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Pris på sparemål (kr)
                        </label>
                        <input
                            type="number"
                            name="savingsGoalCost"
                            value={formData.savingsGoalCost}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex space-x-3 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-lg transition-colors border border-slate-700"
                        >
                            Avbryt
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20"
                        >
                            Lagre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
