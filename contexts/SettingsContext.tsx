
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  emergencyContact: string;
  setEmergencyContact: (name: string) => void;
  emergencyNumber: string;
  setEmergencyNumber: (num: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with empty strings so placeholders (hints) show up in inputs
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");

  return (
    <SettingsContext.Provider value={{
      emergencyContact,
      setEmergencyContact,
      emergencyNumber,
      setEmergencyNumber
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
