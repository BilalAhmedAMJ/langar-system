import { Utensils } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white px-4 md:px-8 py-5 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <Utensils size={28} className="md:w-8 md:h-8" />
          <h1 className="text-xl md:text-3xl font-bold">
            Langar
          </h1>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-green-500 rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          <a href="/" className="hover:bg-green-500 px-3 py-2 rounded-lg transition-all">Calculator</a>
          <a href="/orders" className="hover:bg-green-500 px-3 py-2 rounded-lg transition-all">Orders</a>
          <a href="/admin" className="hover:bg-green-500 px-3 py-2 rounded-lg transition-all">Admin</a>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-green-500/30 pt-4">
          <a href="/" className="block px-3 py-2 hover:bg-green-500 rounded-lg transition-all">Calculator</a>
          <a href="/orders" className="block px-3 py-2 hover:bg-green-500 rounded-lg transition-all">Orders</a>
          <a href="/admin" className="block px-3 py-2 hover:bg-green-500 rounded-lg transition-all">Admin</a>
        </div>
      )}
    </nav>
  );
}