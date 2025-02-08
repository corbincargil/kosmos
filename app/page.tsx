"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="h-32 md:h-auto md:w-1/2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 animate-slide-in flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider animate-fade-in-text">
            kosmos
          </h1>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 animate-fade-in-down">
            Welcome Back
          </h1>
          <div className="animate-fade-in-up">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-center transition-colors duration-300 text-lg"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-center transition-colors duration-300 text-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
