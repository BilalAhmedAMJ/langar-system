"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MenuSelector from "@/components/MenuSelector";
import { calculateSupplyList, SupplyItem } from "@/lib/calculations";
import { supabase } from "@/lib/supabase";
import { exportSupplyToExcel, exportSupplyToPDF } from "@/lib/export";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export default function Home() {
  const [eventName, setEventName] = useState("");
  const [menuItems, setMenuItems] = useState([
    { dish: "", quantity: 0 },
  ]);

  const [supplyList, setSupplyList] = useState<Record<string, SupplyItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedEventName = localStorage.getItem("langar_eventName");
    const savedMenuItems = localStorage.getItem("langar_menuItems");
    const savedSupplyList = localStorage.getItem("langar_supplyList");

    if (savedEventName) {
      setEventName(savedEventName);
    }
    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems));
    }
    if (savedSupplyList) {
      setSupplyList(JSON.parse(savedSupplyList));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("langar_eventName", eventName);
    }
  }, [eventName, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("langar_menuItems", JSON.stringify(menuItems));
    }
  }, [menuItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("langar_supplyList", JSON.stringify(supplyList));
    }
  }, [supplyList, isLoaded]);

  const generateSupplyList = async () => {
  const result = await calculateSupplyList(menuItems);

  setSupplyList(result);

  try {
    const { data, error } = await supabase.from("orders").insert([
      {
        event_name: eventName || "Untitled Event",
        order_data: menuItems,
        supply_output: result,
      },
    ]);

    if (error) {
      console.error("Error saving order:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      alert(`Error saving order: ${error.message || JSON.stringify(error)}`);
    } else {
      console.log("Order saved successfully", data);
    }
  } catch (err) {
    console.error("Exception saving order:", err);
    alert(`Exception saving order: ${err}`);
  }
};

return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
  <Navbar />

  <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">

    {/* Hero Section */}
    <div className="mb-8 md:mb-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Langar Supply Calculator
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
        Generate precise ingredient supply lists instantly for any event size. Streamline your langar planning with our intelligent calculation system.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-4xl mx-auto">

      {/* LEFT SIDE */}
      <Card>
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Build Order
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Select dishes and quantities for your event</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
          <Input
            type="text"
            placeholder="e.g., Wedding Reception, Community Gathering"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <MenuSelector
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />

        <Button
          onClick={generateSupplyList}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 w-full mt-6 md:mt-8 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
        >
          Generate Supply List
        </Button>
      </Card>

      {/* RIGHT SIDE */}
      <Card>
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Supply Output
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Your calculated ingredient requirements</p>
        </div>

        {Object.keys(supplyList).length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="text-gray-500 text-lg">
              No supply list generated yet
            </div>
            <p className="text-gray-600 text-sm mt-2">Generate a supply list to see ingredient requirements</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(
              Object.entries(supplyList).reduce((acc, [ingredient, supply]) => {
                const category = supply.category || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push({ ingredient, ...supply });
                return acc;
              }, {} as Record<string, Array<{ ingredient: string } & SupplyItem>>)
            )
              .sort()
              .map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-3 pb-2 border-b border-gray-600">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.ingredient}
                        className="flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-600 p-3 md:p-4 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-200"
                      >
                        <span className="text-gray-100 font-medium text-sm md:text-base">{item.ingredient}</span>

                        <span className="font-bold text-blue-400 text-base md:text-lg">
                          {Number(item.qty).toFixed(2)} <span className="text-cyan-400">{item.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {Object.keys(supplyList).length > 0 && (
          <div className="flex flex-col md:flex-row gap-3 mt-6 md:mt-8">
            <Button
              onClick={() =>
                exportSupplyToExcel(supplyList)
              }
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 flex-1 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50 text-sm md:text-base"
            >
              Export Excel
            </Button>

            <Button
              onClick={() => exportSupplyToPDF(supplyList)}
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 flex-1 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm md:text-base"
            >
              Download PDF
            </Button>
          </div>
        )}
      </Card>

    </div>
  </div>
</main>
);
}