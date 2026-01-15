"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
    total: number;
    completed: number;
}

export default function ProgressBar({ total, completed }: ProgressBarProps) {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Simple animation on mount
    const [width, setWidth] = useState(0);
    useEffect(() => {
        requestAnimationFrame(() => setWidth(percentage));
    }, [percentage]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Today</h2>
                <span className="text-sm font-medium text-neutral-500">
                    {completed} / {total} completed
                </span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
