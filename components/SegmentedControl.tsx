"use client";

import { clsx } from "clsx";

interface SegmentedControlProps {
    options: string[];
    selected: string;
    onChange: (val: string) => void;
}

export default function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 border-1 border-neutral-100 dark:border-neutral-800 rounded-xl p-1 flex transition-colors">
            {options.map((opt) => {
                const isActive = selected === opt;
                return (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={clsx(
                            "flex-1 py-3 text-sm font-medium rounded-xl transition-all",
                            isActive ? "bg-[#D0BAF2] text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                            // Using the purple accent from image for active tab
                        )}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}
