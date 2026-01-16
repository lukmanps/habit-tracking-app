"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { checkAndShowNotifications } from "@/lib/notifications";

export default function NotificationManager() {
    const habits = useStore((state) => state.habits);

    useEffect(() => {
        // Check every 30 seconds to ensure we don't miss the minute boundary
        const interval = setInterval(() => {
            checkAndShowNotifications(habits);
        }, 30000);

        // Initial check
        checkAndShowNotifications(habits);

        return () => clearInterval(interval);
    }, [habits]);

    return null; // This component doesn't render anything
}
