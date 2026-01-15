export interface Task {
  id: number;
  text: string;
  time: string;
  duration: number;
  color: string;
  completed: boolean;
  completedAt?: string;
}
