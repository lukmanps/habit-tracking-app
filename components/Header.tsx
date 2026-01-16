"use client";

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showSettings?: boolean;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
}

export default function Header({ title, showBack, showSettings, leftAction, rightAction }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 sticky top-0 z-10 transition-colors">
            {leftAction ? (
                <div className="-ml-2">{leftAction}</div>
            ) : showBack ? (
                <Link href="/" className="p-2 -ml-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
            ) : (
                <div className="w-10" /> // Spacer
            )}

            {title && <h1 className="font-semibold text-lg">{title}</h1>}

            {rightAction ? (
                <div className="-mr-2">{rightAction}</div>
            ) : showSettings ? (
                <Link href="/settings" className="p-2 -mr-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                    <Settings size={24} />
                </Link>
            ) : (
                <div className="w-10" />
            )}
        </header>
    );
}
