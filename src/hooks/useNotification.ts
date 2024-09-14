import { useEffect, useRef } from "react";
import { useNotificationPermission } from "./useNotificationPermission";

type UseNotificationOptions = NotificationOptions;

interface UseNotificationParams {
    isTriggered: boolean;
    title: string;
    options?: UseNotificationOptions;
    clickUrl?: string;
}

export function useNotification({
    isTriggered,
    title,
    options,
    clickUrl = "/",
}: UseNotificationParams) {
    const { notificationsEnabled } = useNotificationPermission();
    const isNotificationSupported =
        typeof window !== "undefined" && "Notification" in window;

    const previousIsTriggered = useRef<boolean>(false);

    useEffect(() => {
        if (
            isTriggered &&
            isNotificationSupported &&
            notificationsEnabled &&
            !previousIsTriggered.current
        ) {
            if (notificationsEnabled) {
                try {
                    const notification = new Notification(title, options);

                    notification.onclick = () => {
                        if (window.focus) {
                            window.focus();
                        } else {
                            window.open(clickUrl, "_blank");
                        }
                    };
                } catch (error) {
                    console.error("Failed to send notification:", error);
                }
            }

            previousIsTriggered.current = isTriggered;
        }
    }, [isTriggered, notificationsEnabled, title, options, clickUrl]);
}
