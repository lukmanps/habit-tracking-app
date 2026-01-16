"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trash2, Calendar, Check, Pencil, X } from "lucide-react";
import { format, subDays, isSameDay, getDate } from "date-fns";
import { useStore } from "@/lib/store";
import { calculateStreak, formatDateKey, isScheduledDay, cn } from "@/lib/utils";
import Header from "@/components/Header";
import PageLayout from "@/components/PageLayout";
import { HABIT_COLORS } from "@/lib/constants";
import { Bell, Clock } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";

export default function HabitDetailPage() {
    const router = useRouter();
    const params = useParams(); // { id: string }
    const id = params?.id as string;

    const { habits, logs, deleteHabit, toggleHabit, updateHabit } = useStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Local state for editing
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");
    const [hasReminder, setHasReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");
    const [historyView, setHistoryView] = useState<'week' | 'month'>('week');

    const habit = habits.find((h) => h.id === id);

    useEffect(() => {
        setIsMounted(true);
        if (habit) {
            setEditName(habit.name);
            setEditColor(habit.color);
            setHasReminder(!!habit.reminderTime);
            setReminderTime(habit.reminderTime || "09:00");
        }
    }, [habit]);

    if (!isMounted) return null;

    if (!habit) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>Habit not found</p>
                <button onClick={() => router.push('/')} className="mt-4 text-blue-500">Go Home</button>
            </div>
        );
    }

    const streak = calculateStreak(habit, logs);

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        return subDays(new Date(), 6 - i);
    });

    const last30Days = Array.from({ length: 30 }).map((_, i) => {
        return subDays(new Date(), 29 - i);
    });

    const handleSave = () => {
        if (editName.trim()) {
            updateHabit(id, {
                name: editName,
                color: editColor,
                reminderTime: hasReminder ? reminderTime : undefined
            });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(habit.name);
        setEditColor(habit.color);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this habit? This cannot be undone.")) {
            deleteHabit(id);
            router.push("/");
        }
    };

    const renderDayCell = (date: Date, type: 'week' | 'month') => {
        const dateKey = formatDateKey(date);
        const isScheduled = isScheduledDay(habit, date);
        const isCompleted = logs.some(l => l.habitId === id && l.date === dateKey && l.completed);

        // Labels
        const label = type === 'week' ? format(date, "EEEEE") : getDate(date);

        // Both views interactive only in edit mode
        const isInteractive = isEditing;

        return (
            <button
                key={dateKey}
                onClick={() => isInteractive && toggleHabit(id, dateKey)}
                disabled={!isInteractive || (!isScheduled && !isCompleted && type === 'month')}
                // Allow week view to toggle even if not scheduled? No, keep consistent.
                // Actually, Week view "No need click interaction" unless editing.
                // So disabled={!isInteractive}.
                // But for Month view? "In editing, enable clickable interaction".

                className={cn(
                    type === 'week'
                        ? "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-all"
                        : "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all",
                    isCompleted
                        ? "border-transparent text-white shadow-sm"
                        : isScheduled
                            ? "border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-500 dark:text-neutral-400"
                            : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600",
                    isInteractive && "active:scale-95 hover:border-neutral-300 dark:hover:border-neutral-600 cursor-pointer",
                    !isInteractive && "cursor-default"
                )}
                style={{
                    backgroundColor: isCompleted ? (habit.color || "#000") : undefined
                }}
            >
                {label}
            </button>
        );
    };

    return (
        <PageLayout header={
            <Header
                title={isEditing ? "Edit Habit" : habit.name}
                showBack={!isEditing}
                leftAction={isEditing ? (
                    <button
                        onClick={handleCancel}
                        className="p-2 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                ) : undefined}
                rightAction={
                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={cn(
                            "p-2 rounded-full transition-colors font-medium text-sm flex items-center gap-1",
                            isEditing ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4" : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        )}
                    >
                        {isEditing ? (
                            <>Done</>
                        ) : (
                            <><Pencil size={18} /> Edit</>
                        )}
                    </button>
                }
            />
        }>
            {/* Cancel button if editing - Note: Absolute positioning might need adjustment if inside overflow-hidden parent 
                PageLayout has relative and overflow-hidden.
                This absolute element needs to be inside PageLayout or consistent.
                Currently it was outside the scroll container. PageLayout wraps everything.
            */}

            <div className="flex-1 overflow-y-hidden">

                {isEditing && (
                    <div className="p-4 space-y-3 fade-in-section overflow-hidden">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full text-2xl font-medium border-b-2 border-neutral-100 py-2 focus:outline-none focus:border-neutral-900 placeholder:text-neutral-300 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Color</label>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {HABIT_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setEditColor(c.value)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                                        style={{ backgroundColor: c.value }}
                                    >
                                        {editColor === c.value && <Check size={16} className="text-neutral-900" strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reminder Section */}
                        <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                    <Bell size={14} /> Set Reminder
                                </label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!hasReminder) {
                                            const permission = await requestNotificationPermission();
                                            if (permission === "granted") {
                                                setHasReminder(true);
                                            } else {
                                                alert("Notification permission is required to set reminders.");
                                            }
                                        } else {
                                            setHasReminder(false);
                                        }
                                    }}
                                    className={cn(
                                        "w-12 h-6 rounded-full relative transition-colors duration-300",
                                        hasReminder ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 left-1 bg-white dark:bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300",
                                        hasReminder ? "translate-x-6" : ""
                                    )} />
                                </button>
                            </div>

                            <div className={cn(
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
                    </div>
                )}
                {!isEditing && (
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <span className="text-4xl font-bold text-neutral-900 dark:text-white mb-1">{streak}</span>
                            <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Streak</span>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <span className="text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                                {logs.filter(l => l.habitId === id && l.completed).length}
                            </span>
                            <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Total</span>
                        </div>
                    </div>
                )}

                {/* History View Toggle */}
                <div className="px-4 py-2 mt-2">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl flex gap-1 transition-colors">
                        <button
                            onClick={() => setHistoryView('week')}
                            className={cn(
                                "flex-1 py-1.5 rounded-lg text-sm font-medium transition-all text-center",
                                historyView === 'week' ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            )}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setHistoryView('month')}
                            className={cn(
                                "flex-1 py-1.5 rounded-lg text-sm font-medium transition-all text-center",
                                historyView === 'month' ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            )}
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>

                {/* Last 7 Days View */}
                {historyView === 'week' && (
                    <div className="px-4 py-4">
                        {/* {isEditing && <h3 className="text-sm font-bold text-neutral-900 mb-2">Edit History (7d)</h3>} */}

                        <div className="flex justify-between items-end">
                            {last7Days.map(date => renderDayCell(date, 'week'))}
                        </div>
                    </div>
                )}

                {/* Last 30 Days View */}
                {historyView === 'month' && (
                    <div className="px-4 py-4 pb-20 mb-4">
                        {/* {isEditing && (
                            <h3 className="text-xs font-semibold text-neutral-900 mb-4 flex items-center gap-2 ">
                                <Calendar size={16} className="text-neutral-400" /> Edit History (30d)
                            </h3>
                        )} */}
                        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                            {last30Days.map(date => renderDayCell(date, 'month'))}
                        </div>
                    </div>
                )}
            </div>

            {isEditing && (
                <div className="p-2 mt-auto border-t border-neutral-100 bg-white fade-in-section">
                    <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-2 text-red-500 font-medium pt-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <Trash2 size={20} />
                        Delete Habit
                    </button>
                </div>
            )}
        </PageLayout>
    );
}
