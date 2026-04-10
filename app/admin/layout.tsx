"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold mb-8">
            Admin Panel
          </h2>

          <nav className="space-y-4">
            <Link href="/admin" className="block">
              Dashboard
            </Link>

            <Link href="/admin/menus" className="block">
              Menus
            </Link>

            <Link href="/admin/ingredients" className="block">
              Ingredients
            </Link>

            <Link href="/admin/recipes" className="block">
              Recipes
            </Link>
          </nav>
        </div>

        <button
          onClick={logout}
          className="mt-auto bg-red-600 hover:bg-red-500 px-4 py-3 rounded-xl"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}