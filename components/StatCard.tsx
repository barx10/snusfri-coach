
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 hover:bg-slate-800/60 transition-all duration-300 group">
            <div className="flex-shrink-0 p-3 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">{title}</p>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
