
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Screen, VehicleIssue, ISSUES, IssueSeverity } from './types';
import PhoneShell from './components/PhoneShell';
import LoginScreen from './screens/LoginScreen';
import DrivingScreen from './screens/DrivingScreen';
import AlertScreen from './screens/AlertScreen';
import IssueInfoScreen from './screens/IssueInfoScreen';
import NotificationScreen from './screens/NotificationScreen';
import SettingsScreen from './screens/SettingsScreen';
import { speakText } from './services/ttsService';
import { SettingsProvider } from './contexts/SettingsContext';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [activeIssue, setActiveIssue] = useState<VehicleIssue | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [hasAutoSimulated, setHasAutoSimulated] = useState(false);
  const [shouldAutoPlayAlert, setShouldAutoPlayAlert] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<VehicleIssue[]>([]);
  
  // Use a ref to ensure the auto-trigger logic only ever queues once
  const autoSimQueued = useRef(false);

  const navigateTo = useCallback((screen: Screen, issue?: VehicleIssue, autoPlay: boolean = false) => {
    if (issue) setActiveIssue(issue);
    setShouldAutoPlayAlert(autoPlay);
    setCurrentScreen(screen);
  }, []);

  const triggerIssue = useCallback((issue: VehicleIssue) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const issueWithTime = { ...issue, timestamp };
    
    setActiveIssue(issueWithTime);
    setNotificationHistory(prev => [...prev, issueWithTime]);
    setShowToast(true);
    
    if (issue.severity === IssueSeverity.CRITICAL) {
      setShouldAutoPlayAlert(true); 
      // Simulate auto-navigation after showing toast for CRITICAL issues
      setTimeout(() => {
        setShowToast(false);
        setCurrentScreen(Screen.CRITICAL_ALERT);
      }, 2500);
    } else {
      // For NON-CRITICAL: Stay on driving screen, play voice, show toast
      setShouldAutoPlayAlert(false);
      speakText(`${issue.title}. ${issue.instruction}`);
      
      // Auto-dismiss toast after 6 seconds for non-critical
      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    }
  }, []);

  const deleteNotification = useCallback((index: number) => {
    setNotificationHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  // One-time auto-simulation logic (Engine Overheating after 5 seconds)
  useEffect(() => {
    if (currentScreen === Screen.DRIVING && !hasAutoSimulated && !autoSimQueued.current) {
      autoSimQueued.current = true;
      const timer = setTimeout(() => {
        triggerIssue(ISSUES.ENGINE_TEMP);
        setHasAutoSimulated(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, hasAutoSimulated, triggerIssue]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={() => navigateTo(Screen.DRIVING)} />;
      case Screen.DRIVING:
        return (
          <DrivingScreen 
            onTriggerIssue={triggerIssue} 
            onOpenNotifications={() => navigateTo(Screen.NOTIFICATIONS)}
            onOpenSettings={() => navigateTo(Screen.SETTINGS)}
            showToast={showToast}
            activeIssue={activeIssue}
            notificationCount={notificationHistory.length}
          />
        );
      case Screen.CRITICAL_ALERT:
      case Screen.NON_CRITICAL_ALERT:
        return (
          <AlertScreen 
            issue={activeIssue!} 
            autoPlay={shouldAutoPlayAlert}
            onLearnMore={() => navigateTo(Screen.ISSUE_INFO, activeIssue!, false)}
            onBack={() => navigateTo(Screen.DRIVING)}
          />
        );
      case Screen.ISSUE_INFO:
        return (
          <IssueInfoScreen 
            issue={activeIssue!} 
            onBack={() => {
                // Return to the respective alert screen if critical, otherwise monitor
                if (activeIssue?.severity === IssueSeverity.CRITICAL) {
                    navigateTo(Screen.CRITICAL_ALERT, activeIssue!, false);
                } else {
                    navigateTo(Screen.NON_CRITICAL_ALERT, activeIssue!, false);
                }
            }}
          />
        );
      case Screen.NOTIFICATIONS:
        return (
          <NotificationScreen 
            history={notificationHistory}
            onBack={() => navigateTo(Screen.DRIVING)}
            onClear={() => setNotificationHistory([])}
            onDelete={deleteNotification}
            onSelectIssue={(selectedIssue) => {
              // Navigate to the Alert Screen (Issue Page) instead of Info Screen (Instruction Page)
              const targetScreen = selectedIssue.severity === IssueSeverity.CRITICAL 
                ? Screen.CRITICAL_ALERT 
                : Screen.NON_CRITICAL_ALERT;
              navigateTo(targetScreen, selectedIssue, false);
            }}
          />
        );
      case Screen.SETTINGS:
        return <SettingsScreen onBack={() => navigateTo(Screen.DRIVING)} />;
      default:
        return <LoginScreen onLogin={() => navigateTo(Screen.DRIVING)} />;
    }
  };

  return (
    <PhoneShell>
      {renderScreen()}
    </PhoneShell>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
