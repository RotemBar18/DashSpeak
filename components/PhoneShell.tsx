
import React from 'react';

const PhoneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-gray-800 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-2xl z-50"></div>
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-8">
          {children}
        </div>
        {/* Home Indicator */}
        <div className="h-1 bg-gray-800/20 w-32 mx-auto mb-2 rounded-full mt-auto"></div>
      </div>
    </div>
  );
};

export default PhoneShell;
