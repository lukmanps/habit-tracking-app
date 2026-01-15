"use client";

import { Home, List, Plus, User, BarChart2 } from "lucide-react"; // Using generic icons matching concept
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    // Helper to determine active state
    // Exact match for '/' to avoid highlighting Home on every subpage if mostly shallow routing, 
    // but usually safe.
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-2xl z-50">
            {/* 
         Height: ~80px? 
         Bg: White 
         Radius: Top corners rounded 
         Shadow: subtle
      */}
            <div className="bg-white dark:bg-neutral-950 px-6 pb-6 pt-2 rounded-t-[2.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none border-t border-neutral-100 dark:border-neutral-800 flex items-end justify-between min-h-[5.5rem] relative transition-colors">

                {/* FAB Concept: Floating completely out or overlapping?
             Image shows it centered, overlapping the top edge significantly. 
             We can place it absolutely relative to the container.
         */}
                <Link
                    href="/add-habit"
                    className="absolute -top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all outline-4 outline-neutral-50"
                >
                    <Plus size={28} />
                </Link>

                {/* Left Side */}
                <Link href="/" className="flex flex-col items-center gap-1 w-14">
                    <Home
                        size={24}
                        strokeWidth={isActive("/") ? 2.5 : 2}
                        className={cn("transition-colors", isActive("/") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}
                    />
                    <span className={cn("text-[10px] font-medium transition-colors", isActive("/") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}>
                        Home
                    </span>
                </Link>

                <Link href="/habits" className="flex flex-col items-center gap-1 w-14 mr-6">
                    <List
                        size={24}
                        strokeWidth={isActive("/habits") ? 2.5 : 2}
                        className={cn("transition-colors", isActive("/habits") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}
                    />
                    <span className={cn("text-[10px] font-medium transition-colors", isActive("/habits") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}>
                        Habits
                    </span>
                </Link>

                {/* Spacer for FAB */}
                <div className="w-4" />

                {/* Stats Link */}
                <Link href="/statistics" className="flex flex-col items-center gap-1 w-14">
                    <BarChart2
                        size={24}
                        strokeWidth={isActive("/statistics") ? 2.5 : 2}
                        className={cn("transition-colors", isActive("/statistics") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}
                    />
                    <span className={cn("text-[10px] font-medium transition-colors", isActive("/statistics") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}>
                        Stats
                    </span>
                </Link>


                <Link href="/settings" className="flex flex-col items-center gap-1 w-14">
                    <User
                        size={24}
                        strokeWidth={isActive("/settings") ? 2.5 : 2}
                        className={cn("transition-colors", isActive("/settings") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}
                    />
                    <span className={cn("text-[10px] font-medium transition-colors", isActive("/settings") ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600")}>
                        Profile
                    </span>
                </Link>

            </div>
        </div>
    );
}
