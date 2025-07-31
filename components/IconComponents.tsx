import React from 'react';

interface IconProps {
    className?: string;
}

export const MotorcycleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 2.25l-2.063 4.125m0 0a3.375 3.375 0 11-4.743 4.743 3.375 3.375 0 014.743-4.743zm0-4.125a3.375 3.375 0 00-4.743 4.743m0 0l-1.125 2.25M13.5 2.25L15 5.25m-1.5-3l1.5 3m0 0l2.25 4.5m-3.75-3.75l-2.25 4.5m10.875-2.25a.75.75 0 00-1.138-.636l-3.375 1.95m3.375-1.95a.75.75 0 011.138.636l-1.95 3.375m-3.375-1.95a.75.75 0 00-1.138-.636l-3.375 1.95m3.375-1.95a.75.75 0 011.138.636l-1.95 3.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.25-1.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
    </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 11.25h.008v.008H12v-.008z" />
    </svg>
);

export const CashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h15m1.5 0v2.25" />
    </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a4.5 4.5 0 014.5-4.5v-3.828c0-1.121-.92-2.03-2.043-2.028-1.517.004-2.887.925-3.635 2.373A8.25 8.25 0 009 9.6c0 1.503.621 2.88 1.631 3.863a4.5 4.5 0 011.369-1.213z" />
    </svg>
);
