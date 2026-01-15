import { differenceInDays, format, subDays, isSameDay, getDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Habit, HabitLog } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format date as YYYY-MM-DD for storage/comparisons
export function formatDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export function isScheduledDay(habit: Habit, date: Date): boolean {
    if (habit.frequency === 'daily') return true;
    if (!habit.days || habit.days.length === 0) return false;

    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
    return habit.days.includes(dayOfWeek);
}

export function calculateStreak(habit: Habit, logs: HabitLog[]): number {
    let streak = 0;
    let currentDate = new Date();

    // Normalize to start of day needed? 
    // Actually prompts Logic: 
    // let currentDate = today()
    // while(true) ...

    // The 'today' in prompt implies the checking starts from today back into the past.
    // However, if today is NOT scheduled, should we look at yesterday?
    // "Streak increases only on scheduled days"
    // "Missing a scheduled day resets streak"
    // "Non-scheduled days are ignored"

    // If I haven't done it TODAY yet, but I did it yesterday (and yesterday was scheduled), 
    // is my streak 1 or 0? 
    // Usually, current streak includes today if completed, or yesterday if today is not completed BUT today is valid?
    // Or if today is just not done yet?

    // User Prompt Logic:
    // while (true) {
    //   if (!isScheduledDay(habit, currentDate)) {
    //     currentDate = subDays(currentDate, 1)
    //     continue
    //   }
    //   const log = logs.find...
    //   if (!log?.completed) break
    //   streak++
    //   currentDate = subDays(currentDate, 1)
    // }

    // The logic implies that if I haven't done it TODAY (and today is scheduled), loop breaks immediately.
    // So streak is 0 if I haven't done it today.
    // Many trackers count "yesterday's streak" as active if today is not over.
    // BUT I MUST FOLLOW THE PROMPT LOGIC EXACTLY.

    while (true) {
        if (!isScheduledDay(habit, currentDate)) {
            currentDate = subDays(currentDate, 1);
            continue;
        }

        const dateKey = formatDateKey(currentDate);
        const log = logs.find(
            (l) => l.habitId === habit.id && l.date === dateKey
        );

        if (!log?.completed) {
            // If we are on "Today" and it's not done, some trackers are lenient.
            // But the prompt logic says "break".
            // HOWEVER, if the user requested "Streak increases...", usually if I have a streak of 10, and today I wake up, script says 0?
            // That feels punishable. 
            // The prompt code:
            // if (!log?.completed) break
            //
            // If I am strictly following the prompt, then yes, it resets.
            // BUT, let's look closer. 
            // Is "today" variable in prompt abstract?
            // "let currentDate = today()"

            // Let's implement EXACTLY as prompt first.

            break;
        }

        streak++;
        currentDate = subDays(currentDate, 1);
    }

    // Wait, if I strictly follow that, the user sees "0 streak" every morning until they tick it.
    // That might be demoralizing. 
    // Is it possible the prompt meant "most recent streak"? 
    // "Current streak count"

    // Let's implement it, but maybe check if the First Day (Today) is skipped if valid?
    // Actually, let's Stick to the provided logic function.
    // The user explicitly provided "Use this logic". I must follow specific instructions.

    return streak;
}

export function getCompletedCount(habitId: string, logs: HabitLog[]): number {
    return logs.filter((l) => l.habitId === habitId && l.completed).length;
}
