"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  INGREDIENT_CATEGORIES,
  MEASUREMENT_UNITS,
} from "@/lib/constants";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<any[]>([]);

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCategory, setIngredientCategory] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");

  const [editingIngredient, setEditingIngredient] =
    useState<any>(null);

  const [editIngredientData, setEditIngredientData] =
    useState({
      name: "",
      category: "",
      unit: "",
    });

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const { data } = await supabase
      .from("ingredients")
      .select("*")
      .order("name");

    if (data) setIngredients(data);
  }

  const addIngredient = async () => {
    if (!ingredientName) return;

    await supabase.from("ingredients").insert([
      {
        name: ingredientName,
        category: ingredientCategory,
        unit: ingredientUnit,
      },
    ]);

    setIngredientName("");
    setIngredientCategory("");
    setIngredientUnit("");

    fetchIngredients();
  };

  const deleteIngredient = async (id: number) => {
    await supabase
      .from("ingredients")
      .delete()
      .eq("id", id);

    fetchIngredients();
  };

  const saveIngredientEdit = async () => {
    await supabase
      .from("ingredients")
      .update(editIngredientData)
      .eq("id", editingIngredient.id);

    setEditingIngredient(null);

    fetchIngredients();
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Manage Ingredients
        </h1>
        <p className="text-gray-400 text-lg">Add, edit, and organize your ingredient inventory</p>
      </div>

      {/* Add Ingredient */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-xl shadow-lg mb-12 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Add New Ingredient
        </h2>

        <input
          className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-3"
          placeholder="Ingredient Name"
          value={ingredientName}
          onChange={(e) =>
            setIngredientName(e.target.value)
          }
        />

        <select
          value={ingredientCategory}
          onChange={(e) =>
            setIngredientCategory(e.target.value)
          }
          className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-3"
        >
          <option value="">Select Category</option>

          {INGREDIENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          
        </select>

        <select
          value={ingredientUnit}
          onChange={(e) =>
            setIngredientUnit(e.target.value)
          }
          className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-3"
        >
  <option value="">Select Unit</option>

  {MEASUREMENT_UNITS.map((unit) => (
    <option key={unit} value={unit}>
      {unit}
    </option>
  ))}
</select>

        <button
          onClick={addIngredient}
          className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl"
        >
          Add Ingredient
        </button>
      </div>

      {/* Ingredient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-gray-800 p-5 rounded-xl shadow flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="font-bold text-lg">
                {ingredient.name}
              </h2>

              <p className="text-gray-400 text-sm">
                {ingredient.category} • {ingredient.unit}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingIngredient(
                    ingredient
                  );

                  setEditIngredientData({
                    name: ingredient.name,
                    category:
                      ingredient.category,
                    unit: ingredient.unit,
                  });
                }}
                className="flex-1 bg-blue-600 px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteIngredient(
                    ingredient.id
                  )
                }
                className="flex-1 bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingIngredient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Edit Ingredient
            </h2>

            <input
              className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-3"
              value={editIngredientData.name}
              onChange={(e) =>
                setEditIngredientData({
                  ...editIngredientData,
                  name: e.target.value,
                })
              }
            />

            <input
              className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-3"
              value={editIngredientData.category}
              onChange={(e) =>
                setEditIngredientData({
                  ...editIngredientData,
                  category:
                    e.target.value,
                })
              }
            />

            <input
              className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full mb-4"
              value={editIngredientData.unit}
              onChange={(e) =>
                setEditIngredientData({
                  ...editIngredientData,
                  unit: e.target.value,
                })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={saveIngredientEdit}
                className="flex-1 bg-blue-600 py-3 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingIngredient(null)
                }
                className="flex-1 bg-gray-600 py-3 rounded-xl"
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