
import React, { useState } from 'react';
import { VehicleIssue, IssueSeverity } from '../types';
import VoiceButton from '../components/VoiceButton';
import VehicleIcon from '../components/VehicleIcon';
import { Phone, Send, X, MapPin, Info, ArrowLeft } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-white relative overflow-hidden font-assistant">
      
      {/* 1. Top Status Section - Colored Background */}
      <div 
        className="w-full rounded-b-[3rem] pt-10 pb-14 px-4 flex flex-col items-center shadow-lg relative z-10 transition-colors duration-300 flex-shrink-0"
        style={{ backgroundColor: statusBg }}
      >
         {/* Huge Icon Container */}
         <div 
           className="w-36 h-36 rounded-[2rem] bg-white flex items-center justify-center p-6 shadow-xl border-4 mb-5 transition-transform hover:scale-105 duration-300"
           style={{ borderColor: statusColor }}
         >
           <VehicleIcon id={issue.iconId} color={statusColor} className="w-full h-full" />
         </div>
         
         {/* Title & Hear Button Row */}
         <div className="flex flex-row items-center justify-center gap-3 w-full max-w-sm">
           <h1 
             className="text-3xl font-black text-center leading-[1.1] tracking-tight"
             style={{ color: COLORS.text.primary }}
           >
             {issue.title}
           </h1>
           {/* Voice Button */}
           <div className="flex-shrink-0">
              <VoiceButton text={`${issue.title}. ${issue.instruction}`} autoPlay={autoPlay} />
           </div>
         </div>
      </div>

      {/* 2. Main Content Area - Overlapping the colored header, Scrollable */}
      <div className="flex-1 flex flex-col px-5 -mt-8 z-20 overflow-y-auto scrollbar-hide pt-2">
        
        {/* Instruction Card - High Visibility */}
        <div 
          className="bg-white rounded-[2rem] p-6 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1)] border-2 mb-5 text-center flex-shrink-0"
          style={{ borderColor: statusColor }}
        >
           <p className="text-2xl font-bold leading-tight" style={{ color: COLORS.text.primary }}>
             {issue.instruction}
           </p>
           {issue.reassurance && (
             <p className="text-lg font-semibold mt-2 opacity-70" style={{ color: COLORS.text.secondary }}>
               {issue.reassurance}
             </p>
           )}
        </div>

        {/* Action Controls - Stacked naturally */}
        <div className="flex flex-col gap-3 pb-4">
          
          {/* SOS - Full width, critical */}
          {isCritical && (
            <button 
                onClick={() => setShowSOSModal(true)}
                className="w-full py-5 rounded-[1.8rem] text-2xl font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                style={{ backgroundColor: COLORS.state.critical, color: COLORS.text.white }}
            >
              <Phone className="w-8 h-8 fill-current" />
              SOS CALL
            </button>
          )}

          {/* Secondary Actions Grid - Big Touch Targets */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-white border-2 rounded-[1.8rem] p-3 flex flex-col items-center justify-center gap-2 h-32 shadow-sm active:scale-95 transition-all"
              style={{ borderColor: COLORS.button.secondaryBorder }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: COLORS.card.highlight }}>
                 <Send className="w-6 h-6" style={{ color: COLORS.icon.default }} />
              </div>
              <span className="text-lg font-bold leading-none text-center" style={{ color: COLORS.text.primary }}>Notify<br/>{contactNameDisplay}</span>
            </button>

            <button 
              onClick={onLearnMore}
              className="bg-white border-2 rounded-[1.8rem] p-3 flex flex-col items-center justify-center gap-2 h-32 shadow-sm active:scale-95 transition-all"
              style={{ borderColor: COLORS.button.secondaryBorder }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: COLORS.card.highlight }}>
                 <Info className="w-6 h-6" style={{ color: COLORS.icon.default }} />
              </div>
              <span className="text-lg font-bold leading-none text-center" style={{ color: COLORS.text.primary }}>What<br/>is this?</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Fixed Bottom Footer for Navigation */}
      <div className="px-5 pb-6 pt-2 bg-white z-30 flex-shrink-0">
          <button 
            onClick={onBack}
            className="w-full py-4 rounded-[1.8rem] text-xl font-bold shadow-lg active:scale-[0.98] transition-all border-2 flex items-center justify-center gap-3"
            style={{ 
              backgroundColor: COLORS.button.primaryBg, 
              color: COLORS.button.primaryText,
              borderColor: COLORS.card.highlight,
              boxShadow: `0 8px 20px ${COLORS.card.shadow}`
            }}
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Dashboard
          </button>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md" style={{ backgroundColor: 'rgba(23, 65, 125, 0.85)' }}>
          <div className="rounded-[3rem] w-full p-8 shadow-2xl text-center space-y-6 animate-[pop_0.3s_ease-out] bg-white">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: COLORS.state.criticalBg }}>
               <Phone className="w-12 h-12" style={{ color: COLORS.state.critical }} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black leading-tight" style={{ color: COLORS.text.primary }}>Call 100?</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-6 rounded-[2rem] text-3xl font-black shadow-xl text-white"
                style={{ backgroundColor: COLORS.state.critical }}
              >
                CALL NOW
              </button>
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-5 rounded-[2rem] text-xl font-bold bg-gray-100 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end backdrop-blur-md" style={{ backgroundColor: 'rgba(23, 65, 125, 0.7)' }}>
          <div className="rounded-t-[3rem] w-full p-6 pb-10 shadow-2xl animate-[slide-up_0.4s_ease-out] bg-white">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-2xl font-black tracking-tight" style={{ color: COLORS.text.primary }}>Notify {contactNameDisplay}</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 rounded-full bg-gray-100">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="rounded-[2rem] p-6 mb-6 border-2 relative" style={{ backgroundColor: COLORS.card.system, borderColor: COLORS.card.border }}>
              <div className="flex items-center gap-3 mb-3" style={{ color: COLORS.icon.default }}>
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Location Attached</span>
              </div>
              <p className="text-xl font-bold leading-snug" style={{ color: COLORS.text.primary }}>
                "Emergency: {issue.title}. I'm stopping safely. Location attached."
              </p>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-6 rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 shadow-xl text-white"
              style={{ backgroundColor: COLORS.button.primaryBg }}
            >
              <Send className="w-6 h-6" />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertScreen;
