import * as XLSX from "xlsx";

export function exportSupplyToExcel(supplyList: Record<string, number>) {
  const data = Object.entries(supplyList).map(([ingredient, qty]) => ({
    Ingredient: ingredient,
    Quantity: qty,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Supply List"
  );

  XLSX.writeFile(workbook, "Langar_Supply_List.xlsx");
}