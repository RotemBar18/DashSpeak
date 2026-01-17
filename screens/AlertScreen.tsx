
import React, { useState } from 'react';
import { VehicleIssue, IssueSeverity } from '../types';
import VoiceButton from '../components/VoiceButton';
import VehicleIcon from '../components/VehicleIcon';
import { AlertTriangle, Phone, Send, ChevronRight, X, MapPin, Info } from 'lucide-react';
import { COLORS } from '../colors';
import { useSettings } from '../contexts/SettingsContext';

interface AlertScreenProps {
  issue: VehicleIssue;
  autoPlay: boolean;
  onLearnMore: () => void;
  onBack: () => void;
}

const AlertScreen: React.FC<AlertScreenProps> = ({ issue, autoPlay, onLearnMore, onBack }) => {
  const isCritical = issue.severity === IssueSeverity.CRITICAL;
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { emergencyContact } = useSettings();

  // Status colors based on severity
  const statusColor = isCritical ? COLORS.state.critical : COLORS.state.warning;
  const statusBg = isCritical ? COLORS.state.criticalBg : COLORS.state.warningBg;

  const contactNameDisplay = emergencyContact.trim() || "Family";

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: COLORS.background }}>
      {/* Header - No full background color, just white */}
      <div className="px-8 pt-14 pb-4 flex-shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <AlertTriangle className="w-8 h-8" style={{ color: statusColor }} strokeWidth={2.5} />
          <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: statusColor }}>
            {isCritical ? 'Critical Alert' : 'Vehicle Notice'}
          </p>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic" style={{ color: COLORS.text.primary }}>
          {isCritical ? 'Immediate Action' : 'Attention Required'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 scrollbar-hide">
        {/* Main Status Card */}
        <div className="flex items-center gap-6">
           <div 
             className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center p-6 shadow-xl border-4 flex-shrink-0"
             style={{ 
               backgroundColor: statusBg, 
               borderColor: COLORS.card.base 
             }}
           >
             <VehicleIcon id={issue.iconId} color={statusColor} className="w-full h-full" />
           </div>
           
           <div className="flex flex-col justify-center gap-3 flex-1">
             <h2 className="text-3xl font-black tracking-tight leading-[0.95] break-words line-clamp-2" style={{ color: COLORS.text.primary }}>
               {issue.title}
             </h2>
             <div className="flex justify-start">
                <VoiceButton text={`${issue.title}. ${issue.instruction}`} autoPlay={autoPlay} />
             </div>
           </div>
        </div>

        {/* Action instruction */}
        <div 
          className="p-8 rounded-[2.5rem] border-2 shadow-xl"
          style={{ 
            backgroundColor: statusBg, 
            borderColor: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 146, 60, 0.2)'
          }}
        >
           <p className="text-2xl font-black leading-tight" style={{ color: COLORS.text.primary }}>{issue.instruction}</p>
           {issue.reassurance && (
             <p className="text-lg font-bold mt-2" style={{ color: COLORS.text.secondary }}>{issue.reassurance}</p>
           )}
        </div>

        {/* Actions (SOS, Share, Learn More) */}
        <div className="space-y-4">
          {isCritical && (
            <button 
                onClick={() => setShowSOSModal(true)}
                className="w-full py-7 rounded-3xl text-2xl font-black shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                style={{ backgroundColor: COLORS.state.critical, color: COLORS.text.white }}
            >
              <Phone className="w-8 h-8 fill-current" />
              SOS EMERGENCY
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowShareModal(true)}
              className="border-2 p-6 rounded-3xl font-black text-sm flex flex-col items-center gap-3 shadow-sm transition-all"
              style={{ 
                backgroundColor: COLORS.button.secondaryBg, 
                borderColor: COLORS.button.secondaryBorder,
                color: COLORS.text.primary
              }}
            >
              <Send className="w-7 h-7" style={{ color: COLORS.icon.default }} />
              Notify {contactNameDisplay}
            </button>
            <button 
              onClick={onLearnMore}
              className="border-2 p-6 rounded-3xl font-black text-sm flex flex-col items-center gap-3 shadow-sm transition-all"
              style={{ 
                backgroundColor: COLORS.button.secondaryBg, 
                borderColor: COLORS.button.secondaryBorder,
                color: COLORS.text.primary
              }}
            >
              <Info className="w-7 h-7" style={{ color: COLORS.icon.default }} />
              Detailed View
            </button>
          </div>
        </div>
        
        {/* Spacer for bottom scrolling */}
        <div className="h-4"></div>
      </div>

      {/* Footer - Fixed to bottom */}
      <div className="flex-shrink-0 px-8 pb-8 pt-4 z-30 bg-gradient-to-t from-white via-white to-transparent">
          <button 
            onClick={onBack}
            className="w-full py-5 rounded-2xl text-2xl font-black shadow-lg active:scale-[0.98] transition-all border-4 flex items-center justify-center gap-3"
            style={{ 
              backgroundColor: COLORS.button.primaryBg, 
              color: COLORS.button.primaryText,
              borderColor: COLORS.card.highlight,
              boxShadow: `0 10px 25px ${COLORS.card.shadow}`
            }}
          >
            Back to Track
          </button>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-sm" style={{ backgroundColor: 'rgba(23, 65, 125, 0.9)' }}>
          <div className="rounded-[3rem] w-full p-10 shadow-2xl text-center space-y-8 animate-[pop_0.3s_ease-out]" style={{ backgroundColor: COLORS.background }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: COLORS.state.criticalBg }}>
               <Phone className="w-12 h-12" style={{ color: COLORS.state.critical }} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black leading-tight" style={{ color: COLORS.text.primary }}>Call Emergency Services?</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-8 rounded-3xl text-4xl font-black shadow-xl"
                style={{ backgroundColor: COLORS.state.critical, color: COLORS.text.white }}
              >
                100
              </button>
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-6 rounded-3xl text-xl font-bold"
                style={{ backgroundColor: COLORS.card.highlight, color: COLORS.text.primary }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end backdrop-blur-sm" style={{ backgroundColor: 'rgba(23, 65, 125, 0.8)' }}>
          <div className="rounded-t-[4rem] w-full p-10 pb-16 shadow-2xl animate-[slide-up_0.4s_ease-out]" style={{ backgroundColor: COLORS.background }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black tracking-tighter" style={{ color: COLORS.text.primary }}>Share Status</h3>
              <button onClick={() => setShowShareModal(false)} className="p-3 rounded-2xl" style={{ backgroundColor: COLORS.card.highlight }}>
                <X className="w-6 h-6" style={{ color: COLORS.text.primary }} />
              </button>
            </div>
            
            <div className="rounded-[2rem] p-8 mb-10 border relative" style={{ backgroundColor: COLORS.card.system, borderColor: COLORS.card.border }}>
              <div className="flex items-center gap-3 mb-4" style={{ color: COLORS.icon.default }}>
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Live Location Appended</span>
              </div>
              <p className="text-xl font-bold leading-snug" style={{ color: COLORS.text.primary }}>
                "Emergency Update: {issue.title}. I am stopping the vehicle at 38 Mivtsa Kadesh St. DashSpeak is assisting."
              </p>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-8 rounded-[2rem] text-2xl font-black flex items-center justify-center gap-4 shadow-xl"
              style={{ backgroundColor: COLORS.button.primaryBg, color: COLORS.button.primaryText }}
            >
              <Send className="w-8 h-8" />
              Notify {contactNameDisplay}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertScreen;
