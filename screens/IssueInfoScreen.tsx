
import React from 'react';
import { VehicleIssue } from '../types';
import VoiceButton from '../components/VoiceButton';
import { ChevronLeft, Info, HelpCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { COLORS } from '../colors';

interface IssueInfoScreenProps {
  issue: VehicleIssue;
  onBack: () => void;
}

const IssueInfoScreen: React.FC<IssueInfoScreenProps> = ({ issue, onBack }) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-2 flex items-center gap-4 z-30">
        <button 
          onClick={onBack} 
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border active:scale-95 transition-all flex-shrink-0"
          style={{ 
            backgroundColor: COLORS.button.secondaryBg, 
            borderColor: COLORS.card.border,
            color: COLORS.text.primary
          }}
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={3} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xs font-black tracking-wide mb-0.5 pl-1 uppercase" style={{ color: COLORS.text.secondary }}>Smart Guidance</h1>
          <h2 className="text-2xl font-black tracking-tight leading-none truncate pl-1" style={{ color: COLORS.text.primary }}>{issue.title}</h2>
        </div>
      </div>

      {/* Content Area - Seamless, no border */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-visible">
          {/* Section: Overview */}
          <section className="space-y-3 pt-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: COLORS.card.highlight, borderColor: COLORS.card.border, color: COLORS.icon.default }}>
                  <Info className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black tracking-tight" style={{ color: COLORS.text.primary }}>The Problem</h3>
              </div>
              <VoiceButton text={issue.description} />
            </div>
            <div className="p-6 rounded-3xl border shadow-sm" style={{ backgroundColor: COLORS.card.system, borderColor: COLORS.card.border }}>
              <p className="text-xl font-bold leading-snug" style={{ color: COLORS.text.primary }}>
                {issue.description}
              </p>
            </div>
          </section>

          {/* Section: Action Steps */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: COLORS.card.highlight, borderColor: COLORS.card.border, color: COLORS.icon.default }}>
                  <PlayCircle className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black tracking-tight" style={{ color: COLORS.text.primary }}>Immediate Actions</h3>
              </div>
              <VoiceButton text={`Immediate actions: ${issue.whatToNow.join('. ')}`} />
            </div>
            <div className="space-y-3">
                 {issue.whatToNow.map((step, idx) => (
                   <div key={idx} className="p-5 rounded-3xl border flex gap-4 items-start shadow-sm" style={{ backgroundColor: COLORS.card.base, borderColor: COLORS.card.border }}>
                     <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS.text.primary, color: COLORS.text.white }}>
                        {idx + 1}
                     </span>
                     <p className="text-lg font-bold leading-snug pt-1" style={{ color: COLORS.text.primary }}>{step}</p>
                   </div>
                 ))}
            </div>

          {/* Section: Future Maintenance */}
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: COLORS.card.highlight, borderColor: COLORS.card.border, color: COLORS.icon.default }}>
                   <HelpCircle className="w-5 h-5" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-lg font-black tracking-tight" style={{ color: COLORS.text.primary }}>Next Steps</h3>
              </div>
              <VoiceButton text={`Next steps: ${issue.whatToLater.join('. ')}`} />
            </div>
            <div className="p-6 rounded-3xl border space-y-4 shadow-sm" style={{ backgroundColor: COLORS.card.system, borderColor: COLORS.card.border }}>
               {issue.whatToLater.map((step, idx) => (
                 <div key={idx} className="flex gap-4 items-start" style={{ color: COLORS.text.primary }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: COLORS.icon.secondary }}></div>
                    <p className="text-lg font-bold leading-tight">{step}</p>
                 </div>
               ))}
            </div>
          </section>

          
          <div className="h-2"></div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 pt-2 z-30 bg-gradient-to-t from-white via-white to-transparent">
         <button 
           onClick={onBack}
           className="w-full py-5 rounded-2xl text-xl font-black shadow-lg active:scale-[0.98] transition-all border flex items-center justify-center gap-3"
           style={{ 
             backgroundColor: COLORS.button.primaryBg, 
             color: COLORS.button.primaryText,
             borderColor: COLORS.card.highlight,
             boxShadow: `0 8px 20px ${COLORS.card.shadow}`
           }}
         >
           Back to Issue Page
         </button>
      </div>
    </div>
  );
};

export default IssueInfoScreen;
