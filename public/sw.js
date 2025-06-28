// @ts-nocheck
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      // Mobile-specific options
      requireInteraction: false,
      silent: false,
      tag: "kosmos-notification",
      actions: [
        {
          action: "open",
          title: "Open App",
          icon: "/icon.png",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();

  // Handle different actions
  if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    clients.openWindow(
      process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000"
    )
  );
});
