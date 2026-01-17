
import React from 'react';
import { logoString } from '../assets/Logo';
import { COLORS } from '../colors';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col h-full p-10" style={{ backgroundColor: COLORS.background }}>
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="relative mb-6 w-full max-w-[260px]">
           {/* Subtle glow behind the logo */}
           <div 
             className="absolute inset-0 blur-3xl opacity-20 animate-pulse rounded-full"
             style={{ backgroundColor: COLORS.text.secondary }}
           ></div>
           <img src={logoString} alt="DashSpeak Logo" className="relative z-10" />
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <button
          onClick={onLogin}
          className="w-full text-2xl font-black py-7 rounded-3xl shadow-xl active:scale-[0.97] transition-all"
          style={{ 
            backgroundColor: COLORS.button.primaryBg, 
            color: COLORS.button.primaryText 
          }}
        >
          Connect Vehicle
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
