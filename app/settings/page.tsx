"use client";

import PageLayout from "@/components/PageLayout";
import { useStore } from "@/lib/store";
import { Trash2, Sun, Moon, Monitor, Download, AppWindow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const habits = useStore(state => state.habits);
    const logs = useStore(state => state.logs);
    const clearData = useStore(state => state.clearData);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        setMounted(true);

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleClear = () => {
        if (confirm("Are you sure? This will delete ALL habits and history permanently.")) {
            clearData();
            router.push("/");
        }
    };

    const handleExport = () => {
        const data = {
            habits,
            logs,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    return (
        <PageLayout title="Settings">
            <div className="flex-1 p-6 pb-4 overflow-y-auto">
                <div className="space-y-6">
                    {/* Appearance Section */}
                    <section>
                        <h3 className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4">Appearance</h3>
                        <div className="bg-neutral-50 dark:bg-neutral-900 p-1 rounded-xl flex border border-neutral-100 dark:border-neutral-800 transition-colors">
                            {[
                                { name: 'light', icon: Sun, label: 'Light' },
                                { name: 'dark', icon: Moon, label: 'Dark' },
                                { name: 'system', icon: Monitor, label: 'System' },
                            ].map((t) => {
                                const Icon = t.icon;
                                const isActive = mounted && theme === t.name;
                                return (
                                    <button
                                        key={t.name}
                                        onClick={() => {
                                            console.log('Clicking theme button:', t.name);
                                            console.log('Current theme before:', theme);
                                            setTheme(t.name);
                                            console.log('setTheme called with:', t.name);
                                        }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Data Management Section */}
                    <section>
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">App & Data</h3>
                        <div className="space-y-3">
                            {deferredPrompt && (
                                <button
                                    onClick={handleInstall}
                                    className="w-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl p-4 flex items-center gap-3 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 transition-colors mb-4"
                                >
                                    <AppWindow size={20} />
                                    <div className="flex-1 text-left">
                                        Install Application
                                        <p className="text-xs text-blue-400 dark:text-blue-500 font-normal mt-0.5">Add to your home screen for quick access.</p>
                                    </div>
                                </button>
                            )}

                            <button
                                onClick={handleExport}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl p-4 flex items-center gap-3 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 transition-colors"
                            >
                                <Download size={20} className="text-neutral-500" />
                                <div className="flex-1 text-left">
                                    Export data
                                    <p className="text-xs text-neutral-400 font-normal mt-0.5">Download your habits and history as JSON.</p>
                                </div>
                            </button>

                            <button
                                onClick={handleClear}
                                className="w-full bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl p-4 flex items-center gap-3 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <Trash2 size={20} />
                                <div className="flex-1 text-left">
                                    Clear all data
                                    <p className="text-xs text-red-400 font-normal mt-0.5">Start fresh. Cannot be undone.</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">About</h3>
                        <p className="text-neutral-500 text-sm">
                            Simple Habit Tracker v1.0.0
                            <br />
                            Local-first, distraction-free.
                        </p>
                    </section>
                </div>
            </div>
        </PageLayout>
    );
}
