import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { SupplyItem } from "./calculations";

export function exportSupplyToExcel(supplyList: Record<string, SupplyItem>) {
  const groupedByCategory = Object.entries(supplyList).reduce(
    (acc, [ingredient, supply]) => {
      const category = supply.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        Ingredient: ingredient,
        Quantity: supply.qty,
        Unit: supply.unit,
      });
      return acc;
    },
    {} as Record<string, Array<{ Ingredient: string; Quantity: number; Unit: string }>>
  );

  const data: Array<{ Category?: string; Ingredient: string; Quantity: number; Unit: string }> = [];

  Object.keys(groupedByCategory)
    .sort()
    .forEach((category) => {
      data.push({
        Category: category,
        Ingredient: "",
        Quantity: 0,
        Unit: "",
      });

      groupedByCategory[category].forEach((item) => {
        data.push({
          Ingredient: item.Ingredient,
          Quantity: item.Quantity,
          Unit: item.Unit,
        });
      });
    });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Supply List");

  XLSX.writeFile(workbook, "Langar_Supply_List.xlsx");
}

export function exportSupplyToPDF(supplyList: Record<string, SupplyItem>) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const lineHeight = 8;
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  pdf.setFontSize(20);
  pdf.text("Langar Supply List", margin, yPosition);
  yPosition += 15;

  const groupedByCategory = Object.entries(supplyList).reduce(
    (acc, [ingredient, supply]) => {
      const category = supply.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        ingredient,
        qty: supply.qty,
        unit: supply.unit,
      });
      return acc;
    },
    {} as Record<string, Array<{ ingredient: string; qty: number; unit: string }>>
  );

  Object.keys(groupedByCategory)
    .sort()
    .forEach((category) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(30, 136, 229);
      pdf.text(category, margin, yPosition);
      yPosition += lineHeight + 2;

      pdf.setFontSize(11);
      pdf.setTextColor(0);

      groupedByCategory[category].forEach((item) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 20;
        }

        const qtyText = `${Number(item.qty).toFixed(2)} ${item.unit}`;
        const ingredientWidth = maxWidth * 0.6;
        const qtyWidth = maxWidth * 0.4;

        pdf.text(item.ingredient, margin, yPosition, { maxWidth: ingredientWidth });
        pdf.text(qtyText, margin + ingredientWidth, yPosition, { align: "right", maxWidth: qtyWidth });
        yPosition += lineHeight;
      });

      yPosition += 3;
    });

  pdf.save("Langar_Supply_List.pdf");
}