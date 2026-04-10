import { supabase } from "./supabase";

export async function calculateSupplyList(menuItems: any[]) {
  const totals: Record<string, number> = {};

  for (const item of menuItems) {
    if (!item.dish || item.quantity <= 0) continue;

    // Get menu info
    const { data: menuData } = await supabase
      .from("menus")
      .select("*")
      .eq("name", item.dish)
      .single();

    if (!menuData) continue;

    // Get recipe ingredients
    const { data: recipeData } = await supabase
      .from("recipes")
      .select(`
        quantity,
        ingredients (
          name
        )
      `)
      .eq("menu_id", menuData.id);

    if (!recipeData) continue;

    const multiplier = item.quantity / menuData.serves_per_daigh;

    recipeData.forEach((recipe: any) => {
      const ingredientName = recipe.ingredients.name;
      const totalQty = recipe.quantity * multiplier;

      if (totals[ingredientName]) {
        totals[ingredientName] += totalQty;
      } else {
        totals[ingredientName] = totalQty;
      }
    });
  }

  return totals;
}