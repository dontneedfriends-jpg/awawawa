export interface CostCalculationInput {
  weightGrams: number;
  printTimeMinutes: number;
  materialCostPerGram: number;
  printerHourlyRate: number;
}

export interface CostCalculationResult {
  materialCost: number;
  printCost: number;
  baseCost: number;
  suggestedPrice: (markupPercent: number) => number;
}

export function calculatePartCost(
  input: CostCalculationInput
): CostCalculationResult {
  const materialCost = input.weightGrams * input.materialCostPerGram;
  const printTimeHours = input.printTimeMinutes / 60;
  const printCost = printTimeHours * input.printerHourlyRate;
  const baseCost = materialCost + printCost;
  
  return {
    materialCost,
    printCost,
    baseCost,
    suggestedPrice: (markupPercent: number) => {
      return baseCost * (1 + markupPercent / 100);
    },
  };
}

export function calculateOrderTotal(
  parts: Array<{ baseCost: number; quantity: number }>,
  markupPercent: number
): { subtotal: number; markup: number; total: number } {
  const subtotal = parts.reduce(
    (sum, part) => sum + part.baseCost * part.quantity,
    0
  );
  const markup = subtotal * (markupPercent / 100);
  const total = subtotal + markup;
  
  return { subtotal, markup, total };
}
