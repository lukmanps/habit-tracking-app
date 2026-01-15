"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import PageLayout from "@/components/PageLayout";

export default function HabitsPage() {
    const habits = useStore((state) => state.habits);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <PageLayout title="All Habits">
            <div className="flex-1 overflow-y-auto px-6 pb-4">
                {habits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-neutral-400 mb-4">You haven't added any habits yet.</p>
                        <Link
                            href="/add-habit"
                            className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-medium"
                        >
                            Create your first habit
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        {habits.map((habit) => (
                            <Link
                                key={habit.id}
                                href={`/habit/${habit.id}`}
                                className="block group"
                            >
                                <div className="flex items-center justify-between py-2 px-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: habit.color }}
                                        />

                                        <div>
                                            <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">{habit.name}</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {habit.frequency === 'daily'
                                                    ? 'Every day'
                                                    : `${habit.days?.length} days / week`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
