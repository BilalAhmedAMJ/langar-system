"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MenuSelector from "@/components/MenuSelector";
import { calculateSupplyList } from "@/lib/calculations";
import { supabase } from "@/lib/supabase";
import { exportSupplyToExcel } from "@/lib/export";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
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
  <main className="min-h-screen bg-gray-900 text-gray-300">
  <Navbar />

  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Hero */}
    <div className="mb-10">
      <h1 className="text-5xl font-bold mb-3">
        Langar Supply Calculator
      </h1>

      <p className="text-gray-400 text-lg">
        Generate ingredient supply lists instantly for any event size.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">

      {/* LEFT SIDE */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">
          Build Order
        </h2>

        <MenuSelector
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />

        <Button
          onClick={generateSupplyList}
          className="bg-blue-600 w-full mt-6"
        >
          Generate Supply List
        </Button>
      </Card>

      {/* RIGHT SIDE */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">
          Supply Output
        </h2>

        {Object.keys(supplyList).length === 0 ? (
          <div className="text-gray-400">
            No supply list generated yet.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(supplyList).map(
              ([ingredient, qty]) => (
                <div
                  key={ingredient}
                  className="flex justify-between bg-gray-700 p-4 rounded-xl"
                >
                  <span>{ingredient}</span>

                  <span className="font-bold">
                    {Number(qty).toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {Object.keys(supplyList).length > 0 && (
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() =>
                exportSupplyToExcel(supplyList)
              }
              className="bg-green-600 flex-1"
            >
              Export Excel
            </Button>

            <Button
              onClick={() => window.print()}
              className="bg-gray-600 flex-1"
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