export type Frequency = 'daily' | 'custom';

export type Habit = {
  id: string;
  name: string;
  frequency: Frequency;
  days?: number[]; // 0–6 (Sun–Sat)
  createdAt: string; // ISO String
  icon?: string; // Optional emoji
  color: string; // Hex code or tailwind class
  reminderTime?: string; // Optional "HH:mm"
};

export type HabitLog = {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};


export type AppState = {
  habits: Habit[];
  logs: HabitLog[];
  settings: {
    weekStart: 'sun' | 'mon';
  };
};

export type Store = AppState & {
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'color'> & { color?: string }) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  clearData: () => void;
};
