"use client";

import { Habit, HabitLog } from "@/lib/types";
import { format, isSameDay } from "date-fns";
import { Check } from "lucide-react";
import { cn, isScheduledDay } from "@/lib/utils";

interface WeeklyHabitRowProps {
    habit: Habit;
    dates: Date[]; // 7 days (Mon-Sun)
    logs: HabitLog[];
    onToggle: (date: string) => void;
}

export default function WeeklyHabitRow({ habit, dates, logs, onToggle }: WeeklyHabitRowProps) {
    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-5 mb-4 overflow-hidden border border-neutral-100 dark:border-neutral-800 transition-colors">
            {/* Header: Icon + Name + Frequency */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center ">
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{habit.name}</h3>
                    </div>
                </div>

                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tracking-wide">
                    {habit.frequency === 'daily' ? 'Everyday' : 'Custom'}
                </span>
            </div>

            {/* Days Row */}
            <div className="flex justify-between items-center pt-2">
                {dates.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayLabel = format(date, "EEE"); // Mon, Tue...
                    const isScheduled = isScheduledDay(habit, date);
                    const isCompleted = logs.some(l => l.habitId === habit.id && l.date === dateStr && l.completed);
                    const isFuture = date > new Date(); // Simple check, might need strict comparison

                    // Check strict future (ignoring time)
                    const now = new Date();
                    const isStrictFuture = date.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0);

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                                {dayLabel}
                            </span>

                            <button
                                onClick={() => onToggle(dateStr)}
                                disabled={!isScheduled || isStrictFuture}
                                // "Make the UI... like this" image shows empty circles for incomplete, check for complete.
                                // If not scheduled, how to show? Image shows empty spaces or just circles?
                                // Image seems to have circles for every day. 
                                // Wait, image shows explicit ticks for completed. 
                                // Empty circle for ... incomplete? future?
                                // Let's assume standard behavior:
                                // - Completed: Check with color background.
                                // - Missed/Incomplete (Past): Empty circle (or maybe red/gray?)
                                // - Future: Empty/Disabled.

                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all border border-neutral-200 dark:border-neutral-700",
                                    isCompleted
                                        ? "text-neutral-900"
                                        : "bg-white dark:bg-neutral-800",

                                    !isCompleted && "border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800"
                                )}
                                style={{
                                    backgroundColor: isCompleted ? (habit.color || "#E8C5E5") : undefined
                                }}
                            >
                                {isCompleted && <Check size={16} strokeWidth={3} className="text-neutral-900" />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
