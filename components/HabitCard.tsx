"use client";

import { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

interface HabitCardProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: () => void;
}

export default function HabitCard({ habit, isCompleted, onToggle }: HabitCardProps) {
    // Design:
    // A long rounded pill.
    // Left side: Colored background (opacity 20%? or full color but light?)
    // Right side: dots or empty?
    // In image: They look like progress bars.
    // But for simple boolean habits, we can make the whole bar colored when done, or partly colored?
    // Let's interpret: 
    // - Background is very light version of color.
    // - Foreground bar (progress) fills up.
    // - Since boolean: 0% or 100%.

    // Actually, in the image, the bars are completely filled for some, partly for others.
    // That implies sub-tasks or just style.
    // For a boolean tracker:
    // OFF: Light gray or very light pastel.
    // ON: Full pastel color.

    return (
        <div className="flex items-center gap-3 mb-3">
            {/* We can wrap in Link to detail, but tap should toggle? 
            Usually tap anywhere to toggle is easier, or specific button.
            Let's make whole bar tappable to toggle for now. 
        */}
            <button
                onClick={onToggle}
                className="flex-1 relative py-5 rounded-xl overflow-hidden transition-all active:scale-[0.98]"
                style={{ backgroundColor: isCompleted ? habit.color : '#F5F5F5' }}
            >
                {/* Dark mode background */}
                {!isCompleted && <div className="absolute inset-0 bg-[#F5F5F5] dark:bg-neutral-900 -z-10" />}
                {/* If not completed, maybe show a small sliver of color or just gray?
             Visual from image: "Summary Status" shows bars at different lengths.
             Maybe simple:
             Background: habit.color + low opacity
             Foreground: habit.color (width 100% if done, 0% if not)
         */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: habit.color }}
                />

                {/* Foreground Bar (Completion) */}
                <div
                    className={cn("absolute inset-y-0 left-0 transition-all duration-500 ease-out", isCompleted ? "w-full" : "w-0")}
                    style={{ backgroundColor: habit.color }}
                />

                {/* Check icon or text? */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                    <span className={cn("font-medium transition-colors text-base", isCompleted ? "text-neutral-900" : "text-neutral-500 dark:text-neutral-400")}>
                        {habit.name}
                    </span>
                    {isCompleted && (
                        <div className="bg-white/30 rounded-full p-1">
                            <Check size={16} className="text-neutral-900" strokeWidth={3} />
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
}
