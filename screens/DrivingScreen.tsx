
import React, { useEffect, useState } from 'react';
import { ISSUES, IssueSeverity } from '../types';
import type { VehicleIssue } from '../types';
import { Activity, Bell, Zap, Volume2, Settings, X } from 'lucide-react';
import VehicleIcon from '../components/VehicleIcon';
import { COLORS } from '../colors';

interface DrivingScreenProps {
  onTriggerIssue: (issue: VehicleIssue) => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  showToast: boolean;
  activeIssue: VehicleIssue | null;
  notificationCount: number;
}

const DrivingScreen: React.FC<DrivingScreenProps> = ({ onTriggerIssue, onOpenNotifications, onOpenSettings, showToast, activeIssue, notificationCount }) => {
  const [pulse, setPulse] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [showSimMenu, setShowSimMenu] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => setPulse(p => !p), 2000);
    const dotInterval = setInterval(() => setDotCount(prev => (prev + 1) % 4), 600);
    
    return () => { 
      clearInterval(pulseInterval); 
      clearInterval(dotInterval);
    };
  }, []);

  const isCriticalToast = activeIssue?.severity === IssueSeverity.CRITICAL;
  const dots = ".".repeat(dotCount);
  const hasNotifications = notificationCount > 0;

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: COLORS.background }}>
      {/* Toast Overlay */}
      {showToast && activeIssue && (
        <div className="rounded-[2rem] absolute top-12 left-4 right-4 z-[100] transition-all duration-500 transform translate-y-0 scale-100 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.3)]">
          <div 
            className="rounded-[2rem] overflow-hidden relative flex min-h-[7rem]"
            style={{ 
              backgroundColor: COLORS.card.base,
            }}
          >
            {/* Status Strip - Explicit radius to ensure curve matches parent */}
            <div 
              className="w-4 absolute top-0 bottom-0 left-0 z-10 rounded-l-[2rem]"
              style={{ backgroundColor: isCriticalToast ? COLORS.state.critical : COLORS.state.warning }}
            ></div>

            <div className="flex-1 flex items-center gap-5 p-6 pl-9 relative z-0">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 flex-shrink-0"
                style={{ backgroundColor: isCriticalToast ? COLORS.state.criticalBg : COLORS.state.warningBg }}
              >
                <VehicleIcon id={activeIssue.iconId} color={isCriticalToast ? COLORS.state.critical : COLORS.state.warning} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                <div className="flex items-center gap-2 mb-1.5">
                   <p 
                     className="text-[10px] font-black uppercase tracking-[0.2em]"
                     style={{ color: isCriticalToast ? COLORS.state.critical : COLORS.state.warning }}
                   >
                    {isCriticalToast ? 'Urgent Alert' : 'System Update'}
                   </p>
                   {!isCriticalToast && <Volume2 className="w-3 h-3" style={{ color: COLORS.icon.secondary }} />}
                </div>
                <p 
                  className="text-xl font-black tracking-tight leading-tight"
                  style={{ color: COLORS.text.primary }}
                >
                  {activeIssue.title}
                </p>
                <p 
                  className="text-sm font-bold mt-1.5 leading-snug opacity-90"
                  style={{ color: COLORS.text.secondary }}
                >
                  {activeIssue.instruction}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        {/* Simulate Button & Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowSimMenu(!showSimMenu)}
            className="h-20 w-20 rounded-[2.5rem] shadow-lg border-2 flex items-center justify-center active:scale-90 transition-transform"
            style={{ 
              backgroundColor: showSimMenu ? COLORS.text.primary : COLORS.card.base,
              borderColor: COLORS.card.border 
            }}
          >
            {showSimMenu ? (
              <X className="w-8 h-8" style={{ color: COLORS.text.white }} />
            ) : (
              <Zap className="w-8 h-8" style={{ color: COLORS.state.warning }} fill="currentColor" />
            )}
          </button>

          {/* Simulation Menu Dropdown */}
          {showSimMenu && (
            <div className="absolute top-24 left-0 w-64 bg-white rounded-3xl shadow-2xl p-4 border-2 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 z-50">
              <p className="text-xs font-bold uppercase tracking-widest ml-2 mb-1" style={{color: COLORS.text.disabled}}>Simulate Issue</p>
              {Object.values(ISSUES).map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => {
                    onTriggerIssue(issue);
                    setShowSimMenu(false);
                  }}
                  className="p-4 rounded-2xl text-left font-bold text-sm transition-colors flex items-center gap-3"
                  style={{ backgroundColor: COLORS.card.highlight, color: COLORS.text.primary }}
                >
                  <div className={`w-3 h-3 rounded-full ${issue.severity === IssueSeverity.CRITICAL ? 'bg-red-500' : 'bg-orange-400'}`} />
                  {issue.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="h-20 px-10 rounded-[2.5rem] shadow-lg border-2 flex items-center justify-center gap-4 active:scale-90 transition-transform"
          style={{ 
            backgroundColor: COLORS.button.secondaryBg, 
            borderColor: COLORS.card.border 
          }}
        >
          <Settings className="w-8 h-8" strokeWidth={2.5} style={{ color: COLORS.icon.default }} />
          <span className="text-xl font-black tracking-tight" style={{ color: COLORS.text.primary }}>Settings</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 pt-16 pb-32">
        <div className="relative w-72 h-72 flex items-center justify-center">
           <div 
             className={`absolute inset-0 rounded-full transition-all duration-1000 opacity-5 ${pulse ? 'scale-150' : 'scale-100'}`}
             style={{ backgroundColor: COLORS.button.primaryBg }}
           ></div>
           <div 
             className={`absolute inset-10 rounded-full transition-all duration-1000 opacity-10 ${pulse ? 'scale-125' : 'scale-100'}`}
             style={{ backgroundColor: COLORS.button.primaryBg }}
           ></div>
           
           <div 
             className="w-56 h-56 rounded-[3rem] shadow-2xl flex items-center justify-center border-2 relative z-10"
             style={{ 
               backgroundColor: COLORS.card.base,
               borderColor: COLORS.card.border
             }}
           >
              <Activity className="w-24 h-24 animate-pulse" style={{ color: COLORS.icon.default }} strokeWidth={1.5} />
              
              {/* STATUS BADGE */}
              <div 
                className="absolute -bottom-6 px-5 py-2.5 rounded-2xl font-black tracking-wide text-[11px] shadow-xl w-auto min-w-[150px] flex items-center justify-center whitespace-nowrap overflow-hidden"
                style={{ 
                  backgroundColor: COLORS.button.navBg, 
                  color: COLORS.text.white,
                  boxShadow: `0 10px 30px ${COLORS.card.shadow}`
                }}
              >
                <span className="inline-block">Scanning Car</span>
                <span className="w-4 text-left inline-block ml-0.5">{dots}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Notify Button (Fixed to Bottom, Wide, Big) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-8 pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent">
        <button 
          onClick={onOpenNotifications}
          className="w-full py-5 rounded-[2rem] shadow-xl border-2 flex items-center justify-center gap-4 active:scale-[0.98] transition-all relative overflow-hidden"
          style={{ 
            backgroundColor: hasNotifications ? COLORS.state.critical : COLORS.button.secondaryBg,
            borderColor: hasNotifications ? COLORS.state.critical : COLORS.card.border,
            color: hasNotifications ? COLORS.text.white : COLORS.text.primary
          }}
        >
          <div className="relative">
            <Bell 
              className="w-8 h-8" 
              strokeWidth={2.5} 
              style={{ color: hasNotifications ? COLORS.icon.white : COLORS.icon.default }} 
            />
          </div>
          
          <span className="text-2xl font-black tracking-tight relative z-10">Notifications</span>
          
          {hasNotifications && (
            <div 
              className="px-4 py-2 rounded-2xl text-xl font-black shadow-sm ml-2 min-w-[3.5rem] text-center"
              style={{ backgroundColor: COLORS.card.base, color: COLORS.state.critical }}
            >
              {notificationCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DrivingScreen;
