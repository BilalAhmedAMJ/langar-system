"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    // Clear previous errors
    setError("");

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Login failed");
        console.error("Auth error:", authError);
      } else {
        console.log("Login successful, session data saved");
        // Redirect immediately - auth-context will handle session verification
        router.push("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg shadow-black/20 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Login</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <button
          onClick={login}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded font-semibold transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}