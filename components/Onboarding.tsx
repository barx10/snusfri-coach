import React from 'react';

interface OnboardingProps {
    onStart: () => void;
}

// For å bytte bildet, bare erstatt URL-en nedenfor med en DIREKTE lenke til en bildefil (.jpg, .png etc).
const ONBOARDING_IMAGE_URL = "https://images.pexels.com/photos/18404847/pexels-photo-18404847.jpeg";

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center flex-grow">
            <div className="max-w-md w-full">
                <div className="mb-8">
                   <img
                        src={ONBOARDING_IMAGE_URL}
                        alt="Nærbilde av en Harley Davidson motorsykkel"
                        className="w-full h-auto object-cover rounded-xl shadow-2xl shadow-slate-950/70"
                        aria-label="Nærbilde av en Harley Davidson motorsykkel"
                    />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
                    Klar for friheten?
                </h1>
                <p className="text-lg text-slate-400 mb-8">
                    Start reisen mot et snusfritt liv og din nye motorsykkel i dag. Hver dag teller.
                </p>
                <button
                    onClick={onStart}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-12 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg shadow-amber-500/20"
                >
                    Jeg slutter i dag!
                </button>
            </div>
        </div>
    );
};

export default Onboarding;