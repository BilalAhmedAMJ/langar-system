"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([]);

  const [menuName, setMenuName] = useState("");
  const [servesPerDaigh, setServesPerDaigh] = useState(250);

  const [editingMenu, setEditingMenu] = useState<any>(null);

  const [editMenuData, setEditMenuData] = useState({
    name: "",
    serves_per_daigh: 250,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("name");

    if (data) setMenus(data);
  }

  const addMenu = async () => {
    if (!menuName) return;

    await supabase.from("menus").insert([
      {
        name: menuName,
        serves_per_daigh: servesPerDaigh,
      },
    ]);

    setMenuName("");
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Manage Menus
      </h1>

      {/* Add Menu Form */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg shadow-black/20 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Add New Menu
        </h2>

        <input
          className="border p-3 rounded-xl w-full mb-3"
          placeholder="Menu Name"
          value={menuName}
          onChange={(e) =>
            setMenuName(e.target.value)
          }
        />

        <input
          className="border p-3 rounded-xl w-full mb-3"
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

      {/* Existing Menus */}
      <div className="space-y-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg shadow-black/20 flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">
                {menu.name}
              </h2>

              <p className="text-gray-400">
                Serves: {menu.serves_per_daigh}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingMenu(menu);

                  setEditMenuData({
                    name: menu.name,
                    serves_per_daigh:
                      menu.serves_per_daigh,
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteMenu(menu.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Edit Menu
            </h2>

            <input
              className="border p-3 rounded-xl w-full mb-3"
              value={editMenuData.name}
              onChange={(e) =>
                setEditMenuData({
                  ...editMenuData,
                  name: e.target.value,
                })
              }
            />

            <input
              className="border p-3 rounded-xl w-full mb-4"
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