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
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Innstillinger</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-1">
                            Sluttdato
                        </label>
                        <input
                            type="date"
                            value={dateString}
                            onChange={handleDateChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-1">
                            Daglig kostnad (kr)
                        </label>
                        <input
                            type="number"
                            name="dailyCost"
                            value={formData.dailyCost}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-1">
                            Sparemål (Hva sparer du til?)
                        </label>
                        <input
                            type="text"
                            name="savingsGoal"
                            value={formData.savingsGoal}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-1">
                            Pris på sparemål (kr)
                        </label>
                        <input
                            type="number"
                            name="savingsGoalCost"
                            value={formData.savingsGoalCost}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Avbryt
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
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
