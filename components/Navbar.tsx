import { Utensils } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white px-8 py-5 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Utensils size={30} />
          <h1 className="text-3xl font-bold">
            Langar Management
          </h1>
        </div>
        <div className="flex gap-6">
          <a href="/">Calculator</a>
          <a href="/orders">Orders</a>
          <a href="/admin">Admin</a>
        </div>
      </div>
    </nav>
  );
}