export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
}

export interface StudySession {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  target: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TODO = 'TODO',
  CALENDAR = 'CALENDAR',
  TIMER = 'TIMER',
}

export interface TimerConfig {
  focusTime: number; // in minutes
  breakTime: number; // in minutes
}