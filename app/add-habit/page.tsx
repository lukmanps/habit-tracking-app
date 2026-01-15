"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PageLayout from "@/components/PageLayout";
import { useStore } from "@/lib/store";
import { clsx } from "clsx";
import { HABIT_COLORS } from "@/lib/constants";
import { Check, Bell, Clock } from "lucide-react";

const DAYS = [
    { label: "S", value: 0 },
    { label: "M", value: 1 },
    { label: "T", value: 2 },
    { label: "W", value: 3 },
    { label: "T", value: 4 },
    { label: "F", value: 5 },
    { label: "S", value: 6 },
];

export default function AddHabitPage() {
    const router = useRouter();
    const addHabit = useStore(state => state.addHabit);

    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState<"daily" | "custom">("daily");
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Default all
    const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0].value);

    // Reminder State
    const [hasReminder, setHasReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addHabit({
            name: name.trim(),
            frequency,
            days: frequency === "daily" ? undefined : selectedDays,
            color: selectedColor,
            reminderTime: hasReminder ? reminderTime : undefined,
        });

        router.push("/");
    };

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            // Don't allow empty selection?
            if (selectedDays.length === 1) return;
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day].sort());
        }
    };

    return (
        <PageLayout header={<Header title="New Habit" showBack />} showBottomNav={false}>
            <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col gap-8 pb-10 overflow-y-auto">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Habit Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Read 10 pages"
                        className="w-full text-2xl font-medium border-b-2 border-neutral-100 dark:border-neutral-800 bg-transparent py-2 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 dark:text-white transition-colors"
                        autoFocus
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Frequency
                    </label>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                            type="button"
                            onClick={() => {
                                setFrequency("daily");
                                setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
                            }}
                            className={clsx(
                                "py-1 px-4 rounded-lg border-2 font-medium transition-all",
                                frequency === "daily"
                                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                                    : "border-neutral-100 text-neutral-500 hover:border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700"
                            )}
                        >
                            Every Day
                        </button>
                        <button
                            type="button"
                            onClick={() => setFrequency("custom")}
                            className={clsx(
                                "py-1 px-4 rounded-lg border-2 font-medium transition-all",
                                frequency === "custom"
                                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                                    : "border-neutral-100 text-neutral-500 hover:border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700"
                            )}
                        >
                            Custom
                        </button>
                    </div>

                    {frequency === "custom" && (
                        <div className="flex justify-between pt-2">
                            {DAYS.map((day) => {
                                const isSelected = selectedDays.includes(day.value);
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                                            isSelected
                                                ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20 dark:bg-white dark:text-neutral-900"
                                                : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-700"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {HABIT_COLORS.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setSelectedColor(color.value)}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                            >
                                {selectedColor === color.value && <Check size={20} className="text-neutral-900" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reminder Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                            <Bell size={14} /> Set Reminder
                        </label>
                        <button
                            type="button"
                            onClick={() => setHasReminder(!hasReminder)}
                            className={clsx(
                                "w-12 h-6 rounded-full relative transition-colors duration-300",
                                hasReminder ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-1 left-1 bg-white dark:bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300",
                                hasReminder ? "translate-x-6" : ""
                            )} />
                        </button>
                    </div>

                    <div className={clsx(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        hasReminder ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl flex items-center gap-4 border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <Clock size={20} className="text-neutral-400" />
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="bg-transparent text-lg font-bold text-neutral-900 dark:text-white focus:outline-none w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full bg-neutral-900 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-neutral-900/20 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                    Create Habit
                </button>
            </form>
        </PageLayout>
    );
}
