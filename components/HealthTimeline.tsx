import React from 'react';
import { HealthMilestone } from '../types';

interface HealthTimelineProps {
    quitDate: number;
}

const MILESTONES: HealthMilestone[] = [
    { id: '1', title: 'Normal puls', description: 'Pulsen og blodtrykket synker til normalt nivå.', hoursRequired: 0.33, icon: '❤️' },
    { id: '2', title: 'Nikotinnivået synker', description: 'Mengden nikotin og karbonmonoksid i blodet er halvert.', hoursRequired: 8, icon: '🩸' },
    { id: '3', title: 'Nikotinfri', description: 'All nikotin er ute av kroppen.', hoursRequired: 48, icon: '✨' },
    { id: '4', title: 'Bedre smak og lukt', description: 'Nerveender begynner å vokse ut igjen. Smak og lukt bedres.', hoursRequired: 48, icon: '👃' },
    { id: '5', title: 'Bedre blodsirkulasjon', description: 'Blodsirkulasjonen bedres, og det blir lettere å gå og løpe.', hoursRequired: 336, icon: '🏃' }, // 2 weeks
    { id: '6', title: 'Bedre lungekapasitet', description: 'Lungefunksjonen øker med opptil 30%.', hoursRequired: 2160, icon: '🫁' }, // 3 months
    { id: '7', title: 'Halvert risiko', description: 'Risikoen for hjerte- og karsykdommer er halvert sammenlignet med en snuser.', hoursRequired: 8760, icon: '💓' }, // 1 year
];

const HealthTimeline: React.FC<HealthTimelineProps> = ({ quitDate }) => {
    const hoursSinceQuit = (Date.now() - quitDate) / (1000 * 60 * 60);

    return (
        <div className="glass-panel rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center">
                <span className="mr-2">🏥</span> Helsegevinst
            </h3>
            <div className="space-y-8 relative pl-8 border-l-2 border-slate-700/50 ml-4">
                {MILESTONES.map((milestone) => {
                    const isAchieved = hoursSinceQuit >= milestone.hoursRequired;
                    return (
                        <div key={milestone.id} className={`relative transition-all duration-500 ${isAchieved ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
                            <div className={`absolute -left-[43px] top-0 flex items-center justify-center w-8 h-8 rounded-full border-4 border-slate-900 transition-all duration-500 ${isAchieved ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110' : 'bg-slate-800 text-slate-500'}`}>
                                <span className="text-xs">{milestone.icon}</span>
                            </div>
                            <div className={`${isAchieved ? 'bg-slate-800/40 p-3 rounded-lg -ml-3 -mt-3 backdrop-blur-sm' : ''}`}>
                                <h4 className={`font-bold text-lg ${isAchieved ? 'text-emerald-400' : 'text-slate-300'}`}>{milestone.title}</h4>
                                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{milestone.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HealthTimeline;
