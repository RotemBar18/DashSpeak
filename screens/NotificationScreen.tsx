
import React from 'react';
import { VehicleIssue, IssueSeverity } from '../types';
import { ChevronLeft, Bell, Calendar, Trash2, ChevronRight } from 'lucide-react';
import VehicleIcon from '../components/VehicleIcon';
import { COLORS } from '../colors';

interface NotificationScreenProps {
  history: VehicleIssue[];
  onBack: () => void;
  onClear: () => void;
  onSelectIssue: (issue: VehicleIssue) => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ history, onBack, onClear, onSelectIssue }) => {
  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div className="px-8 pt-14 pb-8 flex items-center justify-between sticky top-0 z-20" style={{ backgroundColor: COLORS.background, borderBottom: `1px solid ${COLORS.divider}` }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-12 h-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ backgroundColor: COLORS.card.highlight, color: COLORS.text.primary }}
          >
            <ChevronLeft className="w-7 h-7" strokeWidth={3} />
          </button>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: COLORS.text.primary }}>Notifications</h1>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear} 
            className="w-12 h-12 rounded-2xl flex items-center justify-center active:scale-90 transition-transform border-2"
            style={{ 
              backgroundColor: COLORS.state.criticalBg, 
              color: COLORS.state.critical,
              borderColor: COLORS.state.criticalBg
            }}
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-20">
            <Bell className="w-20 h-20" style={{ color: COLORS.icon.disabled }} />
            <p className="text-xl font-bold" style={{ color: COLORS.text.disabled }}>No issues recorded yet.</p>
          </div>
        ) : (
          history.slice().reverse().map((issue, idx) => (
            <button 
              key={`${issue.id}-${idx}`} 
              onClick={() => onSelectIssue(issue)}
              className="w-full text-left p-5 rounded-3xl border-2 shadow-sm flex items-center gap-5 relative overflow-hidden active:scale-[0.98] transition-all hover:border-blue-300"
              style={{ 
                backgroundColor: COLORS.card.base,
                borderColor: COLORS.card.border
              }}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: issue.severity === IssueSeverity.CRITICAL ? COLORS.state.criticalBg : COLORS.state.warningBg }}
              >
                <VehicleIcon id={issue.iconId} color={issue.severity === IssueSeverity.CRITICAL ? COLORS.state.critical : COLORS.state.warning} className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p 
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ color: issue.severity === IssueSeverity.CRITICAL ? COLORS.state.critical : COLORS.state.warning }}
                  >
                    {issue.severity === IssueSeverity.CRITICAL ? 'Critical' : 'Alert'}
                  </p>
                  <p className="text-[10px] font-bold flex items-center gap-1" style={{ color: COLORS.text.disabled }}>
                    <Calendar className="w-3 h-3" />
                    {issue.timestamp}
                  </p>
                </div>
                <h3 className="text-lg font-black truncate" style={{ color: COLORS.text.primary }}>{issue.title}</h3>
                <p className="text-sm font-medium truncate" style={{ color: COLORS.text.secondary }}>{issue.instruction}</p>
              </div>
              <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.icon.disabled }} />
            </button>
          ))
        )}
      </div>
      
      <div className="p-8 border-t" style={{ backgroundColor: COLORS.background, borderColor: COLORS.divider }}>
        <button 
          onClick={onBack}
          className="w-full py-6 rounded-[2rem] text-xl font-black shadow-xl"
          style={{ backgroundColor: COLORS.button.navBg, color: COLORS.button.navText }}
        >
          Return to Monitor
        </button>
      </div>
    </div>
  );
};

export default NotificationScreen;
