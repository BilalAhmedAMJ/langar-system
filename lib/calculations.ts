import { supabase } from "./supabase";

export interface SupplyItem {
  qty: number;
  unit: string;
  category: string;
}

export async function calculateSupplyList(menuItems: any[]) {
  const totals: Record<string, SupplyItem> = {};

  for (const item of menuItems) {
    if (!item.dish || item.quantity <= 0) continue;

    // Get menu info
    const { data: menuData } = await supabase
      .from("menus")
      .select("*")
      .eq("name", item.dish)
      .single();

    if (!menuData) continue;

    // Get recipe ingredients with unit and category info
    const { data: recipeData } = await supabase
      .from("recipes")
      .select(`
        quantity,
        ingredients (
          name,
          unit,
          category
        )
      `)
      .eq("menu_id", menuData.id);

    if (!recipeData) continue;

    const multiplier = item.quantity / menuData.serves_per_daigh;

    recipeData.forEach((recipe: any) => {
      const ingredientName = recipe.ingredients.name;
      const ingredientUnit = recipe.ingredients.unit;
      const ingredientCategory = recipe.ingredients.category;
      const totalQty = recipe.quantity * multiplier;

      if (totals[ingredientName]) {
        totals[ingredientName].qty += totalQty;
      } else {
        totals[ingredientName] = {
          qty: totalQty,
          unit: ingredientUnit,
          category: ingredientCategory || "Uncategorized",
        };
      }
    });
  }

  return totals;
}