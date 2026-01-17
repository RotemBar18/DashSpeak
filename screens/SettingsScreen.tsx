
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ChevronLeft, User, Phone } from 'lucide-react';
import { COLORS } from '../colors';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { 
    emergencyContact, 
    setEmergencyContact,
    emergencyNumber,
    setEmergencyNumber
  } = useSettings();

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="px-8 pt-14 pb-8 flex items-center gap-4 sticky top-0 z-20" style={{ borderBottom: `1px solid ${COLORS.divider}` }}>
        <button 
          onClick={onBack} 
          className="w-12 h-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ backgroundColor: COLORS.card.highlight, color: COLORS.text.primary }}
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: COLORS.text.primary }}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        
        {/* Section: Emergency Contact */}
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest px-1" style={{ color: COLORS.text.secondary }}>Emergency Contact</h2>
          
          <div className="p-6 rounded-[2rem] border-2 shadow-sm space-y-6" style={{ backgroundColor: COLORS.card.base, borderColor: COLORS.card.border }}>
            
            {/* Name Input */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.button.secondaryBg, border: `2px solid ${COLORS.button.secondaryBorder}` }}>
                <User className="w-6 h-6" style={{ color: COLORS.icon.secondary }} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold block mb-1" style={{ color: COLORS.text.disabled }}>Contact Name</label>
                <input 
                  type="text" 
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full text-xl font-black bg-transparent border-b-2 outline-none py-1"
                  style={{ color: COLORS.text.primary, borderColor: COLORS.divider }}
                  placeholder="e.g. Mom"
                />
              </div>
            </div>

            {/* Number Input */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.button.secondaryBg, border: `2px solid ${COLORS.button.secondaryBorder}` }}>
                <Phone className="w-6 h-6" style={{ color: COLORS.icon.secondary }} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold block mb-1" style={{ color: COLORS.text.disabled }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={emergencyNumber}
                  onChange={(e) => setEmergencyNumber(e.target.value)}
                  className="w-full text-xl font-black bg-transparent border-b-2 outline-none py-1"
                  style={{ color: COLORS.text.primary, borderColor: COLORS.divider }}
                  placeholder="e.g. 055-123-1234"
                />
              </div>
            </div>

            <p className="text-xs font-medium opacity-70 pt-2" style={{ color: COLORS.text.primary }}>
              This contact will be used for the "Family Notify" feature during alerts.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsScreen;
