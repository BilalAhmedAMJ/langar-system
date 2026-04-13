"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? "w-64" : "w-20"
      } fixed left-0 top-0 h-screen bg-gray-800 border-r border-gray-700 p-6 flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-50`}>
        <div className="flex justify-between items-center mb-8">
          {sidebarOpen && (
            <h2 className="text-2xl font-bold">
              Admin
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="space-y-4 flex-1">
          <Link 
            href="/" 
            className="block p-3 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-3"
            title="Home"
          >
            <span className="text-xl min-w-fit">🏠</span>
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link 
            href="/admin" 
            className="block p-3 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-3"
            title="Dashboard"
          >
            <span className="text-xl min-w-fit">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link 
            href="/admin/menus" 
            className="block p-3 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-3"
            title="Menus"
          >
            <span className="text-xl min-w-fit">🍽️</span>
            {sidebarOpen && <span>Menus</span>}
          </Link>

          <Link 
            href="/admin/ingredients" 
            className="block p-3 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-3"
            title="Ingredients"
          >
            <span className="text-xl min-w-fit">🥕</span>
            {sidebarOpen && <span>Ingredients</span>}
          </Link>

          <Link 
            href="/admin/recipes" 
            className="block p-3 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-3"
            title="Recipes"
          >
            <span className="text-xl min-w-fit">📋</span>
            {sidebarOpen && <span>Recipes</span>}
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-auto w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-4 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center gap-3 justify-center"
          title="Logout"
        >
          <span className="text-lg">🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className={`${
        sidebarOpen ? "ml-64" : "ml-20"
      } p-10 transition-all duration-300 ease-in-out min-h-screen`}>{children}</main>
    </div>
  );
}