"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}!</CardTitle>
          <CardDescription>
            This is your dashboard. You can see all users below.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
