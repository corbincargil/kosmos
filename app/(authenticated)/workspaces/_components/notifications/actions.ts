"use server";

import webpush from "web-push";

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface SerializedPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscription: SerializedPushSubscription | null = null;

export async function subscribeUser(sub: SerializedPushSubscription) {
  subscription = sub;
  //todo: store subscription in database
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  //todo: remove subscription from database
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
