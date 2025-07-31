
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-slate-800 rounded-xl p-5 shadow-lg flex items-center space-x-4 border border-slate-700/50">
            <div className="flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
