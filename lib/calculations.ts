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

    const mode = item.mode || "people";
    const multiplier =
      mode === "daigh"
        ? item.quantity
        : item.quantity / menuData.serves_per_daigh;

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

export interface IngredientCostBreakdown {
  ingredient: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface DishCostSummary {
  dish: string;
  servings: number;
  totalCost: number;
  perPersonCost: number;
  breakdown: IngredientCostBreakdown[];
}

const WEIGHT_UNITS: Record<string, number> = {
  g: 1,
  kg: 1000,
  lb: 453.59237,
  oz: 28.349523125,
};

const VOLUME_UNITS: Record<string, number> = {
  ml: 1,
  L: 1000,
};

function convertToBaseQuantity(value: number, unit: string) {
  const safeValue = Number(value) || 0;
  const normalizedUnit = String(unit || "").trim();

  if (!normalizedUnit) return safeValue;

  if (WEIGHT_UNITS[normalizedUnit]) {
    return safeValue * WEIGHT_UNITS[normalizedUnit];
  }

  if (VOLUME_UNITS[normalizedUnit]) {
    return safeValue * VOLUME_UNITS[normalizedUnit];
  }

  return safeValue;
}

export async function calculateDishCost(
  menuName: string,
  quantity = 1,
  mode: "people" | "daigh" = "people"
): Promise<DishCostSummary> {
  const { data: menuData } = await supabase
    .from("menus")
    .select("*")
    .eq("name", menuName)
    .single();

  if (!menuData) {
    return {
      dish: menuName,
      servings: 0,
      totalCost: 0,
      perPersonCost: 0,
      breakdown: [],
    };
  }

  const { data: recipeData } = await supabase
    .from("recipes")
    .select(`
      quantity,
      ingredients (
        name,
        unit,
        bulk_price,
        bulk_quantity,
        bulk_unit
      )
    `)
    .eq("menu_id", menuData.id);

  if (!recipeData) {
    return {
      dish: menuName,
      servings: Number(menuData.serves_per_daigh) || 0,
      totalCost: 0,
      perPersonCost: 0,
      breakdown: [],
    };
  }

  const servings = Number(menuData.serves_per_daigh) || 0;
  const baseCost = recipeData.reduce((sum: number, recipe: any) => {
    const ingredient = recipe.ingredients;

    if (!ingredient) return sum;

    const recipeQty = Number(recipe.quantity) || 0;
    const recipeUnit = ingredient.unit || "";
    const bulkPrice = Number(ingredient.bulk_price) || 0;
    const bulkQty = Number(ingredient.bulk_quantity) || 0;
    const bulkUnit = ingredient.bulk_unit || recipeUnit || "";

    const baseRecipeQty = convertToBaseQuantity(recipeQty, recipeUnit);
    const baseBulkQty = convertToBaseQuantity(bulkQty, bulkUnit);
    const costPerBaseUnit = baseBulkQty > 0 ? bulkPrice / baseBulkQty : 0;

    return sum + baseRecipeQty * costPerBaseUnit;
  }, 0);

  const quantityMultiplier =
    mode === "daigh"
      ? Number(quantity) || 0
      : (Number(quantity) || 0) / Math.max(servings, 1);

  const totalCost = baseCost * quantityMultiplier;

  return {
    dish: menuName,
    servings,
    totalCost,
    perPersonCost: servings > 0 ? baseCost / servings : 0,
    breakdown: recipeData
      .map((recipe: any) => {
        const ingredient = recipe.ingredients;

        if (!ingredient) return null;

        const recipeQty = Number(recipe.quantity) || 0;
        const recipeUnit = ingredient.unit || "";
        const bulkPrice = Number(ingredient.bulk_price) || 0;
        const bulkQty = Number(ingredient.bulk_quantity) || 0;
        const bulkUnit = ingredient.bulk_unit || recipeUnit || "";

        const baseRecipeQty = convertToBaseQuantity(recipeQty, recipeUnit);
        const baseBulkQty = convertToBaseQuantity(bulkQty, bulkUnit);
        const costPerBaseUnit = baseBulkQty > 0 ? bulkPrice / baseBulkQty : 0;
        const ingredientCost = baseRecipeQty * costPerBaseUnit;

        return {
          ingredient: ingredient.name,
          quantity: recipeQty,
          unit: recipeUnit,
          cost: ingredientCost,
        };
      })
      .filter(Boolean) as IngredientCostBreakdown[],
  };
}