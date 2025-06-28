import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
import { Input } from "@/components/ui/input";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsMobile(
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );

    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
    } catch (error) {
      console.error("Failed to subscribe:", error);
      if (isMobile) {
        alert(
          "Please ensure notifications are enabled in your browser settings and try again."
        );
      }
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return (
      <div className="mt-4">
        <div className="border-t border-border mt-4" />
        <h3 className="text-xl font-semibold mb-4">Push Notifications</h3>
        <p className="text-sm text-muted-foreground">
          {isMobile
            ? "Push notifications are not supported in this mobile browser. Try using Chrome or Safari."
            : "Push notifications are not supported in this browser."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="border-t border-border mt-4" />
      <h3 className="text-xl font-semibold mb-4">Push Notifications</h3>
      {isMobile && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            📱 Mobile detected: Make sure to allow notifications when prompted
            and add this app to your home screen for the best experience.
          </p>
        </div>
      )}
      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are subscribed to push notifications.
          </p>
          <div className="flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={sendTestNotification} className="w-fit">
                Send Test
              </Button>
              <Button onClick={unsubscribeFromPush} variant="destructive">
                Unsubscribe
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are not subscribed to push notifications.
          </p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </div>
      )}
    </div>
  );
}
