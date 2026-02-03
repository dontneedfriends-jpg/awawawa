import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  customerPhone: z.string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  customerEmail: z.string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  customerTelegram: z.string()
    .regex(/^@?[\w]+$/, "Invalid Telegram username")
    .optional()
    .or(z.literal("")),
  parts: z.array(z.object({
    partId: z.string(),
    quantity: z.number().int().positive("Quantity must be positive"),
  })).min(1, "Order must have at least one part"),
  markup: z.number().min(0).max(500, "Markup cannot exceed 500%"),
  notes: z.string().max(1000).optional(),
});

export const partSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  materialId: z.string().min(1, "Material is required"),
  weightGrams: z.number()
    .positive("Weight must be positive")
    .max(10000, "Weight seems too high"),
  printTimeMinutes: z.number()
    .positive("Print time must be positive")
    .max(10000, "Print time seems too high"),
  defaultMarkupPercent: z.number().min(0).max(500),
  category: z.string().max(50).optional(),
});

export const materialSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["PLA", "PETG", "ABS", "TPU", "Nylon", "ASA", "PC", "Other"]),
  color: z.string().max(30).optional(),
  brand: z.string().max(50).optional(),
  costPerGram: z.number().positive("Cost must be positive"),
  currentStockGrams: z.number().min(0),
  lowStockThreshold: z.number().min(0),
  printTempMin: z.number().optional(),
  printTempMax: z.number().optional(),
  bedTempMin: z.number().optional(),
  bedTempMax: z.number().optional(),
  notes: z.string().max(500).optional(),
});

export const printerSchema = z.object({
  name: z.string().min(1).max(50),
  model: z.string().max(100).optional(),
  hourlyRate: z.number().min(0),
  powerConsumptionWatts: z.number().min(0).max(5000),
  electricityCostPerKwh: z.number().min(0),
  maintenanceIntervalHours: z.number().int().positive(),
});

export const maintenanceLogSchema = z.object({
  printerId: z.string(),
  type: z.enum([
    "cleaning",
    "lubrication",
    "belt_tension",
    "nozzle_change",
    "bed_leveling",
    "firmware_update",
    "other"
  ]),
  description: z.string().min(1).max(500),
  cost: z.number().min(0).optional(),
});
