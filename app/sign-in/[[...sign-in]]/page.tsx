"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const hasAnimated = localStorage.getItem("signInAnimated");
    if (!hasAnimated) {
      setShouldAnimate(true);
      localStorage.setItem("signInAnimated", "true");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-2">
      <div
        className={`flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden ${
          shouldAnimate ? "animate-fade-in" : ""
        }`}
      >
        <div
          className={`h-24 md:h-auto md:w-1/2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 ${
            shouldAnimate ? "animate-slide-in" : ""
          } flex items-center justify-center`}
        >
          <h1
            className={`text-4xl md:text-6xl font-bold text-white tracking-wider ${
              shouldAnimate ? "animate-fade-in-text" : ""
            }`}
          >
            kosmos
          </h1>
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-6 flex items-center justify-center">
          <div
            className={`w-full max-w-sm ${
              shouldAnimate ? "animate-fade-in-up" : ""
            }`}
          >
            <SignIn fallbackRedirectUrl="/signed-in" />
          </div>
        </div>
      </div>
    </div>
  );
}
