"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">
          Saved Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5"
            >
              <h2 className="font-bold">
                Order #{order.id}
              </h2>

              <p>
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </p>

              <pre className="bg-gray-100 p-4 rounded mt-3 overflow-auto">
                {JSON.stringify(
                  order.order_data,
                  null,
                  2
                )}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}