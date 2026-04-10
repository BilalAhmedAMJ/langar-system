"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecipesPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const [selectedMenu, setSelectedMenu] =
    useState("");

  const [selectedIngredient, setSelectedIngredient] =
    useState("");

  const [quantity, setQuantity] = useState(0);

  const [editingRecipe, setEditingRecipe] =
    useState<any>(null);

  const [editQuantity, setEditQuantity] =
    useState(0);

  useEffect(() => {
    fetchMenus();
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (selectedMenu) fetchRecipes();
  }, [selectedMenu]);

  async function fetchMenus() {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("name");

    if (data) setMenus(data);
  }

  async function fetchIngredients() {
    const { data } = await supabase
      .from("ingredients")
      .select("*")
      .order("name");

    if (data) setIngredients(data);
  }

  async function fetchRecipes() {
    const { data } = await supabase
      .from("recipes")
      .select(`
        *,
        ingredients (*)
      `)
      .eq("menu_id", selectedMenu);

    if (data) setRecipes(data);
  }

const addRecipeIngredient = async () => {
  const existing = recipes.find(
    (recipe) =>
      recipe.ingredient_id ===
      Number(selectedIngredient)
  );

  if (existing) {
    alert(
      "This ingredient already exists in the recipe."
    );
    return;
  }
if (quantity <= 0) {
  alert("Quantity must be greater than 0.");
  return;
}
  await supabase.from("recipes").insert([
    {
      menu_id: Number(selectedMenu),
      ingredient_id: Number(
        selectedIngredient
      ),
      quantity,
    },
  ]);

  setQuantity(0);

  fetchRecipes();
};
  const deleteRecipeIngredient = async (
    id: number
  ) => {
    await supabase
      .from("recipes")
      .delete()
      .eq("id", id);

    fetchRecipes();
  };

  const saveRecipeEdit = async () => {
    await supabase
      .from("recipes")
      .update({
        quantity: editQuantity,
      })
      .eq("id", editingRecipe.id);

    setEditingRecipe(null);

    fetchRecipes();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Manage Recipes
      </h1>

      {/* Select Menu */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <select
          className="bg-gray-700 p-3 rounded-xl w-full"
          value={selectedMenu}
          onChange={(e) =>
            setSelectedMenu(
              e.target.value
            )
          }
        >
          <option value="">
            Select Menu
          </option>

          {menus.map((menu) => (
            <option
              key={menu.id}
              value={menu.id}
            >
              {menu.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Ingredient */}
      {selectedMenu && (
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl mb-4">
            Add Ingredient to Recipe
          </h2>

          <select
            className="bg-gray-700 p-3 rounded-xl w-full mb-3"
            value={selectedIngredient}
            onChange={(e) =>
              setSelectedIngredient(
                e.target.value
              )
            }
          >
            <option value="">
              Select Ingredient
            </option>

            {ingredients.map(
              (ingredient) => (
                <option
                  key={
                    ingredient.id
                  }
                  value={
                    ingredient.id
                  }
                >
                  {
                    ingredient.name
                  }
                </option>
              )
            )}
          </select>

          <input
            type="number"
            className="bg-gray-700 p-3 rounded-xl w-full mb-3"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Number(
                  e.target.value
                )
              )
            }
          />

          <button
            onClick={
              addRecipeIngredient
            }
            className="bg-green-600 px-5 py-3 rounded-xl"
          >
            Add Ingredient
          </button>
        </div>
      )}

      {/* Recipe List */}
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-gray-800 p-5 rounded-xl flex justify-between"
          >
            <div>
              <h2>
                {
                  recipe
                    .ingredients
                    ?.name
                }
              </h2>

              <p>
                Qty:{" "}
                {
                  recipe.quantity
                }{" "}
                {
                  recipe
                    .ingredients
                    ?.unit
                }
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingRecipe(
                    recipe
                  );

                  setEditQuantity(
                    recipe.quantity
                  );
                }}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteRecipeIngredient(
                    recipe.id
                  )
                }
                className="bg-red-600 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-xl mb-4">
              Edit Quantity
            </h2>

            <input
              type="number"
              value={editQuantity}
              onChange={(e) =>
                setEditQuantity(
                  Number(
                    e.target.value
                  )
                )
              }
              className="bg-gray-700 p-3 rounded-xl w-full mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={
                  saveRecipeEdit
                }
                className="flex-1 bg-blue-600 py-3 rounded"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingRecipe(
                    null
                  )
                }
                className="flex-1 bg-gray-600 py-3 rounded"
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