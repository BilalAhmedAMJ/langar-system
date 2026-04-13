"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MenuSelector from "@/components/MenuSelector";
import { calculateSupplyList } from "@/lib/calculations";
import { supabase } from "@/lib/supabase";
import { exportSupplyToExcel } from "@/lib/export";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export default function Home() {
  const [menuItems, setMenuItems] = useState([
    { dish: "", quantity: 0 },
  ]);

  const [supplyList, setSupplyList] = useState<Record<string, number>>({});

  const generateSupplyList = async () => {
  const result = await calculateSupplyList(menuItems);

  setSupplyList(result);

  await supabase.from("orders").insert([
    {
      order_data: menuItems,
      supply_output: result,
    },
  ]);
};

return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
  <Navbar />

  <div className="max-w-7xl mx-auto px-6 py-16">

    {/* Hero Section */}
    <div className="mb-16">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Langar Supply Calculator
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
        Generate precise ingredient supply lists instantly for any event size. Streamline your langar planning with our intelligent calculation system.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">

      {/* LEFT SIDE */}
      <Card>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Build Order
          </h2>
          <p className="text-gray-400 mt-2">Select dishes and quantities for your event</p>
        </div>

        <MenuSelector
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />

        <Button
          onClick={generateSupplyList}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 w-full mt-8 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
        >
          Generate Supply List
        </Button>
      </Card>

      {/* RIGHT SIDE */}
      <Card>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Supply Output
          </h2>
          <p className="text-gray-400 mt-2">Your calculated ingredient requirements</p>
        </div>

        {Object.keys(supplyList).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No supply list generated yet
            </div>
            <p className="text-gray-600 text-sm mt-2">Generate a supply list to see ingredient requirements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(supplyList).map(
              ([ingredient, qty]) => (
                <div
                  key={ingredient}
                  className="flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-200"
                >
                  <span className="text-gray-100 font-medium">{ingredient}</span>

                  <span className="font-bold text-blue-400 text-lg">
                    {Number(qty).toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {Object.keys(supplyList).length > 0 && (
          <div className="flex gap-3 mt-8">
            <Button
              onClick={() =>
                exportSupplyToExcel(supplyList)
              }
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 flex-1 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50"
            >
              Export Excel
            </Button>

            <Button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 flex-1 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Print PDF
            </Button>
          </div>
        )}
      </Card>

    </div>
  </div>
</main>
);
}