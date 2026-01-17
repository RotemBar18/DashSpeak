
export enum Screen {
  LOGIN = 'LOGIN',
  DRIVING = 'DRIVING',
  CRITICAL_ALERT = 'CRITICAL_ALERT',
  NON_CRITICAL_ALERT = 'NON_CRITICAL_ALERT',
  ISSUE_INFO = 'ISSUE_INFO',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS'
}

export enum IssueSeverity {
  CRITICAL = 'CRITICAL',
  NON_CRITICAL = 'NON_CRITICAL'
}

export interface VehicleIssue {
  id: string;
  title: string;
  severity: IssueSeverity;
  iconId: 'engine_temp' | 'tires';
  instruction: string;
  reassurance?: string;
  description: string;
  whatToNow: string[];
  whatToLater: string[];
  whenToHelp: string;
  timestamp?: string; // Added for notification history
}

export const ISSUES: Record<string, VehicleIssue> = {
  ENGINE_TEMP: {
    id: 'engine_temp',
    title: 'Engine Overheating',
    severity: IssueSeverity.CRITICAL,
    iconId: 'engine_temp',
    instruction: 'PULL OVER and turn off the engine immediately.',
    description: 'The engine coolant temperature is dangerously high. Continuing to drive will cause permanent engine failure.',
    whatToNow: [
      'Safely pull over to the side of the road',
      'Turn off the engine immediately',
      'Open the hood ONLY after 20 minutes of cooling',
      'Do not touch the radiator cap'
    ],
    whatToLater: [
      'Check coolant levels once engine is cold',
      'Inspect for visible leaks under the car'
    ],
    whenToHelp: 'If the gauge stays high after restarting, do not drive. Call for a tow.'
  },
  TIRES: {
    id: 'tires',
    title: 'Low tire pressure',
    severity: IssueSeverity.NON_CRITICAL,
    iconId: 'tires',
    instruction: 'Check tire pressure at the nearest station.',
    reassurance: 'Not dangerous right now, but address soon.',
    description: 'One or more tires are below recommended pressure levels. This affects fuel efficiency and handling.',
    whatToNow: [
      'Maintain a steady, moderate speed',
      'Locate the nearest gas station with air service',
      'Inspect tires for visible punctures'
    ],
    whatToLater: [
      'Refill tires to the PSI listed on your door sticker',
      'Monitor pressure over the next 24 hours'
    ],
    whenToHelp: 'Seek professional help if the pressure drops again within 24 hours.'
  }
};
