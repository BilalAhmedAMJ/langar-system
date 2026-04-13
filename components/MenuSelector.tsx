"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MenuItem = {
  dish: string;
  quantity: number;
};

type Props = {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

export default function MenuSelector({ menuItems, setMenuItems }: Props) {
  const [availableMenus, setAvailableMenus] = useState<string[]>([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    const { data } = await supabase.from("menus").select("name");

    if (data) {
      setAvailableMenus(data.map((menu) => menu.name));
    }
  }

  const updateMenu = (
    index: number,
    field: keyof MenuItem,
    value: string | number
  ) => {
    const updated = [...menuItems];
    updated[index][field] = value as never;
    setMenuItems(updated);
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { dish: "", quantity: 0 }]);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {menuItems.map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <select
            className="border border-gray-300 p-3 rounded-xl flex-1 bg-white text-black"
            value={item.dish}
            onChange={(e) => updateMenu(index, "dish", e.target.value)}
          >
            <option value="">Select Dish</option>
            

            {availableMenus.map((menu) => (
              <option key={menu}>{menu}</option>
            ))}
          </select>

          <input
            type="number"
            className="border border-gray-300 p-3 rounded-xl flex-1 bg-white text-black"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) =>
              updateMenu(index, "quantity", Number(e.target.value))
            }
          />

          <button
            onClick={() => removeMenuItem(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl md:w-auto w-full font-semibold transition-all"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addMenuItem}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl mt-2 w-full md:w-auto font-semibold transition-all"
      >
        + Add Dish
      </button>
    </div>
  );
}