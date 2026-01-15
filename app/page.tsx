"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { isScheduledDay, formatDateKey } from "@/lib/utils";
import DonutChart from "@/components/DonutChart";
import BottomNav from "@/components/BottomNav";
import SegmentedControl from "@/components/SegmentedControl";
import HabitCard from "@/components/HabitCard";
import WeeklyHabitRow from "@/components/WeeklyHabitRow";
import PageLayout from "@/components/PageLayout";
import { startOfWeek, addDays, subDays } from "date-fns";

export default function Home() {
  const { habits, logs, toggleHabit, settings } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState("Today");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const today = new Date();
  const dateKey = formatDateKey(today);

  // Filter habits for today
  const todaysHabits = habits.filter((h) => isScheduledDay(h, today));

  // Determine segments for chart (Today View)
  const segments = todaysHabits.map(h => {
    const isCompleted = logs.some(l => l.habitId === h.id && l.date === dateKey && l.completed);
    return {
      color: h.color || "#ccc",
      completed: isCompleted
    };
  });

  const completedCount = segments.filter(s => s.completed).length;

  // Calculate Week Dates
  const weekStart = startOfWeek(today, { weekStartsOn: settings.weekStart === 'sun' ? 0 : 1 });
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <PageLayout title="Welcome,">
      <div className="px-6 pb-6 space-y-6 pt-2 shrink-0 z-10 bg-white dark:bg-neutral-950 transition-colors">
        <SegmentedControl
          options={["Today", "Weekly", "Monthly"]}
          selected={view}
          onChange={setView}
        />

        {/* Today View Header (Charts) - keeping this fixed as per previous design? 
            Yes, in previous step I made "Statistics and Charts remain pinned".
            So all this content below the title was also fixed.
        */}
        {view === "Today" && (
          <div className="fade-in-section">
            <div>
              <p className="text-center font-medium text-neutral-600 dark:text-neutral-400 mb-6">
                Today's Progress: <span className="bg-[#FAE1DD] dark:bg-red-900/30 px-2 py-0.5 rounded-md text-neutral-900 dark:text-red-200 font-bold">{completedCount}/{todaysHabits.length}</span> habits done.
              </p>

              <div className="flex items-center justify-center gap-8 mb-2">
                {/* Legend */}
                <div className="space-y-3 hidden sm:block">
                  {todaysHabits.slice(0, 4).map(h => (
                    <div key={h.id} className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="truncate max-w-[100px]">{h.name}</span>
                    </div>
                  ))}
                  {todaysHabits.length > 4 && <div className="text-xs text-neutral-400 dark:text-neutral-500 pl-5">...and {todaysHabits.length - 4} more</div>}
                </div>

                <div className="flex-shrink-0">
                  <DonutChart
                    segments={segments}
                    completedCount={completedCount}
                    radius={80}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">

        {/* Today View List */}
        {view === "Today" && (
          <div className="fade-in-section">

            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Summary Status</h2>
              <div className="space-y-1">
                {todaysHabits.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 dark:text-neutral-600">
                    No habits for today. Add one below!
                  </div>
                ) : (
                  todaysHabits.map(habit => {
                    const isCompleted = logs.some(l => l.habitId === habit.id && l.date === dateKey && l.completed);
                    return (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={isCompleted}
                        onToggle={() => toggleHabit(habit.id, dateKey)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Weekly View */}
        {view === "Weekly" && (
          <div className="fade-in-section space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-10 text-neutral-400">
                No habits created yet.
              </div>
            ) : (
              habits.map((habit) => (
                <WeeklyHabitRow
                  key={habit.id}
                  habit={habit}
                  dates={weekDates}
                  logs={logs}
                  onToggle={(date) => toggleHabit(habit.id, date)}
                />
              ))
            )}
          </div>
        )}

        {/* Monthly View Placeholder */}
        {view === "Monthly" && (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
            <p>Monthly view coming soon</p>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
