"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

const FOOD_CATEGORIES = ["Rice", "Curry", "Drinks", "Dessert", "Vege", "Breakfast", "Other", "Daal"];

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([]);

  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [servesPerDaigh, setServesPerDaigh] = useState(250);

  const [editingMenu, setEditingMenu] = useState<any>(null);

  const [editMenuData, setEditMenuData] = useState({
    name: "",
    category: "",
    serves_per_daigh: 250,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("category, name");

    if (data) setMenus(data);
  }

  const addMenu = async () => {
    if (!menuName) return;

    await supabase.from("menus").insert([
      {
        name: menuName,
        category: menuCategory,
        serves_per_daigh: servesPerDaigh,
      },
    ]);

    setMenuName("");
    setMenuCategory("");
    setServesPerDaigh(250);

    fetchMenus();
  };

  const deleteMenu = async (id: number) => {
    await supabase
      .from("menus")
      .delete()
      .eq("id", id);

    fetchMenus();
  };

  const saveMenuEdit = async () => {
    await supabase
      .from("menus")
      .update(editMenuData)
      .eq("id", editingMenu.id);

    setEditingMenu(null);

    fetchMenus();
  };

  // Group menus by category
  const menusByCategory = FOOD_CATEGORIES.reduce((acc, category) => {
    acc[category] = menus.filter(m => m.category === category);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Manage Menus
        </h1>
        <p className="text-gray-400 text-lg">Configure dishes and serving sizes for your events</p>
      </div>

      {/* Add Menu Form */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-xl shadow-lg mb-12 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Add New Menu
        </h2>

        <input
          className="border p-3 rounded-xl w-full mb-3 bg-white text-black"
          placeholder="Menu Name"
          value={menuName}
          onChange={(e) =>
            setMenuName(e.target.value)
          }
        />

        <select
          className="border p-3 rounded-xl w-full mb-3 bg-white text-black"
          value={menuCategory}
          onChange={(e) =>
            setMenuCategory(e.target.value)
          }
        >
          <option value="">Select Category</option>
          {FOOD_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          className="border p-3 rounded-xl w-full mb-3 bg-white text-black"
          type="number"
          placeholder="Serves Per Daigh"
          value={servesPerDaigh}
          onChange={(e) =>
            setServesPerDaigh(
              Number(e.target.value)
            )
          }
        />

        <Button className="bg-green-600">
  Add Menu
</Button>
      </div>

      {/* Existing Menus by Category */}
      <div className="space-y-10">
        {FOOD_CATEGORIES.map((category) => {
          const categoryMenus = menusByCategory[category];
          if (categoryMenus.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryMenus.map((menu) => (
                  <div
                    key={menu.id}
                    className="bg-gray-800 p-5 rounded-xl shadow-lg shadow-black/20 flex flex-col justify-between"
                  >
                    <div className="mb-4">
                      <h2 className="font-bold text-lg">
                        {menu.name}
                      </h2>

                      <p className="text-gray-400 text-sm">
                        Serves: {menu.serves_per_daigh}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMenu(menu);

                          setEditMenuData({
                            name: menu.name,
                            category: menu.category,
                            serves_per_daigh:
                              menu.serves_per_daigh,
                          });
                        }}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteMenu(menu.id)
                        }
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Edit Menu
            </h2>

            <input
              className="border p-3 rounded-xl w-full mb-3 bg-white text-black"
              value={editMenuData.name}
              onChange={(e) =>
                setEditMenuData({
                  ...editMenuData,
                  name: e.target.value,
                })
              }
            />

            <select
              className="border p-3 rounded-xl w-full mb-3 bg-white text-black"
              value={editMenuData.category}
              onChange={(e) =>
                setEditMenuData({
                  ...editMenuData,
                  category: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              {FOOD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="border p-3 rounded-xl w-full mb-4 bg-white text-black"
              type="number"
              value={
                editMenuData.serves_per_daigh
              }
              onChange={(e) =>
                setEditMenuData({
                  ...editMenuData,
                  serves_per_daigh:
                    Number(e.target.value),
                })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={saveMenuEdit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingMenu(null)
                }
                className="flex-1 bg-gray-300 py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}