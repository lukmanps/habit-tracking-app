export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
        return "denied";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return "denied";
    }
};

export const showNotification = (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            icon: "/favicon.ico", // Default icon
            ...options,
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
};

export const checkAndShowNotifications = (habits: any[]) => {
    if (!("Notification" in window)) {
        console.warn("Notifications not supported in this browser");
        return;
    }

    if (Notification.permission !== "granted") {
        console.log("Notification permission not granted, state:", Notification.permission);
        return;
    }

    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;
    const currentDay = now.getDay();

    console.log(`[Notification Service] Checking ${habits.length} habits at ${currentTime}`);

    habits.forEach((habit) => {
        if (habit.reminderTime) {
            console.log(`[Notification Service] Checking habit: ${habit.name}, reminder: ${habit.reminderTime}, current: ${currentTime}`);

            if (habit.reminderTime === currentTime) {
                // Check if it's supposed to run today
                const isDaily = habit.frequency === "daily";
                const isScheduledToday = isDaily || (habit.days && habit.days.includes(currentDay));

                console.log(`[Notification Service] Match found for ${habit.name}! Scheduled today: ${isScheduledToday}`);

                if (isScheduledToday) {
                    // Prevent multiple notifications in the same minute
                    const lastNotifiedKey = `last_notified_${habit.id}`;
                    const lastNotifiedTime = localStorage.getItem(lastNotifiedKey);

                    if (lastNotifiedTime !== currentTime) {
                        console.log(`[Notification Service] Triggering notification for ${habit.name}`);
                        showNotification(`Time for your habit: ${habit.name}!`, {
                            body: "Don't forget to complete your task today.",
                            tag: habit.id, // Group notifications by habit
                            requireInteraction: true,
                        });
                        localStorage.setItem(lastNotifiedKey, currentTime);
                    } else {
                        console.log(`[Notification Service] Already notified for ${habit.name} at ${currentTime}`);
                    }
                }
            }
        }
    });
};
