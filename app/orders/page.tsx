"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

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

  const handleOrderClick = (order: any) => {
    localStorage.setItem("langar_eventName", order.event_name || "");
    localStorage.setItem("langar_menuItems", JSON.stringify(order.order_data));
    localStorage.setItem("langar_supplyList", JSON.stringify(order.supply_output));
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="mb-8 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Saved Orders
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              View your previous supply list calculations. Click any order to restore it.
            </p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <div className="text-center py-12 md:py-16">
                <p className="text-gray-400 text-lg">No orders found yet</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const orderDate = new Date(order.created_at).toLocaleString();
                const itemCount = order.order_data?.filter((item: any) => item.dish).length || 0;
                const ingredientCount = Object.keys(order.supply_output || {}).length;

                return (
                  <div
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 md:p-6 hover:from-gray-600 hover:to-gray-500 cursor-pointer transition-all duration-200 border border-gray-600 hover:border-blue-400 shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {order.event_name || `Order #${order.id}`}
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base mb-3">
                          {orderDate}
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex flex-col">
                            <span className="text-gray-400 text-sm">Dishes Selected</span>
                            <span className="text-blue-400 font-semibold text-lg">
                              {itemCount}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400 text-sm">Ingredients Required</span>
                            <span className="text-cyan-400 font-semibold text-lg">
                              {ingredientCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                          Load Order
                        </span>
                      </div>
                    </div>

                    {order.order_data && order.order_data.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-500">
                        <p className="text-gray-300 text-sm mb-2">
                          <span className="font-semibold">Dishes:</span>{" "}
                          {order.order_data
                            .filter((item: any) => item.dish)
                            .map((item: any) => `${item.dish} (${item.quantity})`)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}