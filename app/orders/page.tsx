"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Saved Orders
          </h1>
          <p className="text-gray-400 text-sm md:text-lg">View your previous supply list calculations</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-base md:text-lg">No orders found yet</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 shadow-lg"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm mt-2">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-600 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-gray-200 text-xs md:text-sm font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(
                      order.order_data,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </>
  );
}