"use client";

import { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { isScheduledDay, formatDateKey } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import PageLayout from "@/components/PageLayout";
import Header from "@/components/Header";
import { startOfWeek, addDays, subDays, isSameDay, format } from "date-fns";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatisticsPage() {
    const { habits, logs, settings } = useStore();
    const [isMounted, setIsMounted] = useState(false);
    const [graphView, setGraphView] = useState<'week' | 'month'>('week');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- Metrics Calculation ---
    const stats = useMemo(() => {
        if (!isMounted) return null;

        const today = new Date();
        const dateKey = formatDateKey(today);

        // 1. Daily Progress
        const todaysHabits = habits.filter(h => isScheduledDay(h, today));
        const completedToday = todaysHabits.filter(h =>
            logs.some(l => l.habitId === h.id && l.date === dateKey && l.completed)
        ).length;
        const dailyPercentage = todaysHabits.length > 0
            ? Math.round((completedToday / todaysHabits.length) * 100)
            : 0;


        // 2. Weekly Graph Data (Mon-Sun)
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        const weekData = Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(startOfCurrentWeek, i);
            const dKey = formatDateKey(date);
            const scheduledForDay = habits.filter(h => isScheduledDay(h, date));
            const completedForDay = scheduledForDay.filter(h =>
                logs.some(l => l.habitId === h.id && l.date === dKey && l.completed)
            ).length;
            const percentage = scheduledForDay.length > 0
                ? Math.round((completedForDay / scheduledForDay.length) * 100)
                : 0;

            return {
                day: format(date, "EEEE"),
                shortDay: format(date, "EEE"),
                percentage,
                isToday: isSameDay(date, today)
            };
        });

        // 3. Monthly Graph Data (Last 30 Days)
        // Group by 5-day chunks or just show a smoothed line? 
        // Showing 30 points on mobile is tight. Let's do last 30 days every day point.
        // Or last 4 weeks? Let's do last 30 days.
        const monthData = Array.from({ length: 30 }).map((_, i) => {
            const date = subDays(today, 29 - i); // End today
            const dKey = formatDateKey(date);
            const scheduledForDay = habits.filter(h => isScheduledDay(h, date));
            const completedForDay = scheduledForDay.filter(h =>
                logs.some(l => l.habitId === h.id && l.date === dKey && l.completed)
            ).length;
            const percentage = scheduledForDay.length > 0
                ? Math.round((completedForDay / scheduledForDay.length) * 100)
                : 0;

            return {
                day: format(date, "d"),
                percentage,
                isToday: isSameDay(date, today)
            };
        });


        // 4. Current Streak
        let currentStreak = 0;
        let checkDate = today;
        const hasActivityToday = habits.some(h => {
            const dKey = formatDateKey(today);
            return logs.some(l => l.habitId === h.id && l.date === dKey && l.completed);
        });

        if (!hasActivityToday) {
            checkDate = subDays(today, 1);
        }

        for (let i = 0; i < 365; i++) {
            const dKey = formatDateKey(checkDate);
            const hasActivity = habits.some(h =>
                logs.some(l => l.habitId === h.id && l.date === dKey && l.completed)
            );

            if (hasActivity) {
                currentStreak++;
                checkDate = subDays(checkDate, 1);
            } else {
                break;
            }
        }

        return {
            dailyPercentage,
            weekData,
            monthData,
            currentStreak
        };

    }, [habits, logs, isMounted]);

    if (!isMounted) return null;

    const graphData = graphView === 'week' ? stats?.weekData : stats?.monthData;

    return (
        <PageLayout title="Statistics">

            <div className="flex-1 px-6 pt-6 pb-4 space-y-4 overflow-y-auto">

                {/* Daily Progress Card - Compact */}
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-800 flex items-center gap-6 transition-colors">
                    <div className="relative w-24 h-24 flex-shrink-0">
                        {/* Simple SVG Donut */}
                        <svg className="w-full h-full rotate-270" viewBox="0 0 36 36">
                            <path
                                className="text-neutral-100 dark:text-neutral-800"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="text-[#D8B4FE] transition-all duration-1000 ease-out"
                                strokeDasharray={`${stats?.dailyPercentage || 0}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-lg font-bold text-neutral-900 dark:text-white">{stats?.dailyPercentage}%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Daily Progress</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                            Completed <span className="font-bold text-neutral-900 dark:text-neutral-200">{stats?.dailyPercentage}%</span> of today's goals.
                        </p>
                    </div>
                </div>


                {/* Streak & Graph Card - Compact */}
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6 transition-colors">

                    {/* Top Row: Streak + Toggle */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#E9D5FF] dark:bg-purple-900/30 p2.5 rounded-full text-[#9333EA] dark:text-purple-400">
                                <Flame size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Current Streak</h2>
                                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {stats?.currentStreak} Days
                                </div>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl flex gap-1 transition-colors">
                            <button
                                onClick={() => setGraphView('week')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    graphView === 'week' ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                )}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setGraphView('month')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    graphView === 'month' ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                )}
                            >
                                Month
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section: Graph */}
                    <div className="w-full h-32 p-4 relative">
                        {/* SVG Line Chart */}
                        <svg className="w-full h-full text-purple-500 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line
                                    key={y}
                                    x1="0"
                                    y1={50 - y / 2}
                                    x2="100"
                                    y2={50 - y / 2}
                                    stroke="#F3F4F6"
                                    strokeWidth="0.5"
                                    strokeDasharray="2"
                                />
                            ))}

                            {/* Area Fill */}
                            <polygon
                                fill="url(#gradient)"
                                points={`0,50 ${graphData?.map((d: any, i: number) => {
                                    const totalPoints = graphData.length - 1;
                                    const x = (i / totalPoints) * 100;
                                    const y = 50 - (d.percentage / 100) * 50;
                                    return `${x},${y}`;
                                }).join(" ")} 100,50`}
                            />

                            {/* Line */}
                            <polyline
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                                points={graphData?.map((d: any, i: number) => {
                                    const totalPoints = graphData.length - 1;
                                    const x = (i / totalPoints) * 100;
                                    const y = 50 - (d.percentage / 100) * 50;
                                    return `${x},${y}`;
                                }).join(" ")}
                            />

                            {/* Dots (Only for Week View) */}
                            {graphView === 'week' && graphData?.map((d: any, i: number) => {
                                const totalPoints = 6;
                                const x = (i / totalPoints) * 100;
                                const y = 50 - (d.percentage / 100) * 50;
                                return (
                                    <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        className="fill-white stroke-purple-500 stroke-[0.5]"
                                    />
                                );
                            })}
                        </svg>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between mt-2 px-1">
                            {graphView === 'week' ? (
                                graphData?.map((d: any, i: number) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "text-[10px] font-medium transition-colors",
                                            d.isToday ? "text-purple-600 font-bold" : "text-neutral-400"
                                        )}
                                    >
                                        {d.shortDay.charAt(0)}
                                    </span>
                                ))
                            ) : (
                                <>
                                    <span className="text-[10px] text-neutral-400 font-medium">30 Days Ago</span>
                                    <span className="text-[10px] text-neutral-400 font-medium">Today</span>
                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </PageLayout>
    );
}
