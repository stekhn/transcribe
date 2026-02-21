import { useState, useEffect } from "react";

type NotificationPermissionStatus = NotificationPermission | "unsupported";

export function useNotificationPermission() {
  const isNotificationSupported =
    typeof window !== "undefined" && "Notification" in window;
  const [permission, setPermission] = useState<NotificationPermissionStatus>(
    isNotificationSupported ? Notification.permission : "unsupported",
  );
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  const requestPermission = () => {
    if (isNotificationSupported && permission === "default") {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
        if (perm === "granted") setNotificationsEnabled(true);
      });
    }
  };

  const toggleNotifications = (isEnabled: boolean) => {
    if (isEnabled && permission === "default") {
      requestPermission();
    } else {
      setNotificationsEnabled(isEnabled);
    }
  };

  useEffect(() => {
    const storedValue = window.localStorage.getItem("switch-notification");
    setNotificationsEnabled(
      JSON.parse(storedValue || "false") && permission === "granted",
    );
  }, [permission]);

  return {
    permission,
    notificationsEnabled,
    toggleNotifications,
    requestPermission,
  };
}
