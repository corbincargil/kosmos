"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User } from "@/types/user";

interface UserCardProps {
  email: string;
  clerkUserId: string;
}

function UserCard({ email, clerkUserId }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{email}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Clerk User ID: {clerkUserId}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <UserButton />
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome, {user?.firstName}!</CardTitle>
                <CardDescription>
                  This is your dashboard. You can see all users below.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user: User) => (
                <UserCard
                  key={user.id}
                  email={user.email}
                  clerkUserId={user.clerkUserId}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
