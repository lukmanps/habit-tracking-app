"use client";


// I should avoid adding too many deps if I can.
// I will use standard CSS transitions or Tailwind animate-spin etc.
// Or just basic state.
// "Dynamic animations" were in the generic web app guidelines, but the USER REQUEST said "No visual clutter", "fast".
// Simple transition-all is enough.

import { Check, Flame, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Habit, HabitLog } from "@/lib/types";
import { cn, calculateStreak } from "@/lib/utils";
import { formatDateKey } from "@/lib/utils"; // I need to make sure this is exported or I rewrite it
import { useStore } from "@/lib/store";

interface HabitRowProps {
    habit: Habit;
    logs: HabitLog[];
    date: Date; // The date being viewed (usually today)
}

export default function HabitRow({ habit, logs, date }: HabitRowProps) {
    const toggleHabit = useStore((state) => state.toggleHabit);

    const dateKey = formatDateKey(date);
    const isCompleted = logs.some(
        (l) => l.habitId === habit.id && l.date === dateKey && l.completed
    );

    const streak = calculateStreak(habit, logs);

    return (
        <div className="group flex items-center justify-between p-4 bg-white border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => toggleHabit(habit.id, dateKey)}
                    className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        isCompleted
                            ? "bg-neutral-900 border-neutral-900 text-white"
                            : "border-neutral-300 text-transparent hover:border-neutral-400"
                    )}
                >
                    <Check size={16} strokeWidth={3} />
                </button>

                <Link href={`/habit/${habit.id}`} className="flex-1">
                    <h3 className={cn(
                        "text-lg font-medium transition-colors",
                        isCompleted ? "text-neutral-400 line-through" : "text-neutral-900"
                    )}>
                        {habit.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <Flame size={12} className={streak > 0 ? "text-orange-500 fill-orange-500" : "text-neutral-300"} />
                        <span className={streak > 0 ? "text-orange-600 font-medium" : ""}>{streak} day streak</span>
                    </div>
                </Link>
            </div>

            <Link href={`/habit/${habit.id}`} className="p-2 text-neutral-300 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={20} />
            </Link>
        </div>
    );
}
