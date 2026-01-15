import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Store, Habit, HabitLog, AppState } from './types';
import { formatDateKey } from './utils';
import { HABIT_COLORS } from './constants';

const STORAGE_KEY = 'habit-tracker-v1';

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            habits: [],
            logs: [],
            settings: {
                weekStart: 'sun',
            },

            addHabit: (habitData) => {
                // Auto-assign random color if not provided
                const randomColor = habitData.color || HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)].value;

                const newHabit: Habit = {
                    ...habitData,
                    color: randomColor,
                    id: uuidv4(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    habits: [...state.habits, newHabit],
                }));
            },

            updateHabit: (id, updates) => {
                set((state) => ({
                    habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
                }));
            },

            deleteHabit: (id) => {
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== id),
                    logs: state.logs.filter((l) => l.habitId !== id),
                }));
            },

            toggleHabit: (habitId, date) => {
                set((state) => {
                    const existingLogIndex = state.logs.findIndex(
                        (l) => l.habitId === habitId && l.date === date
                    );

                    if (existingLogIndex > -1) {
                        // Toggle
                        const newLogs = [...state.logs];
                        newLogs[existingLogIndex].completed = !newLogs[existingLogIndex].completed;
                        return { logs: newLogs };
                    } else {
                        // Create
                        const newLog: HabitLog = {
                            habitId,
                            date,
                            completed: true,
                        };
                        return { logs: [...state.logs, newLog] };
                    }
                });
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                }));
            },

            clearData: () => {
                set({ habits: [], logs: [] });
            },
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
