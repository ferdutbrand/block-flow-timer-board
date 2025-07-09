
export interface Task {
  id: string;
  title: string;
  duration: number; // minutos - now allows any positive number
  pauseDuration: 5 | 15 | 30; // minutos
  timeSpent: number; // segundos
  pauseTime: number; // segundos
  isActive: boolean;
  isPaused: boolean;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}
