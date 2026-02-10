export interface Task {
  id: number;
  text: string;
  time: string;
  duration: number;
  color: string;
  completed: boolean;
  completedAt?: string;
  section: 'today' | 'thisWeek' | 'other';
  isSavedTemplate?: boolean;
  saveAsTemplate?: boolean; // Flag to also save as template
}
