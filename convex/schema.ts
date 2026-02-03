import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Orders Table
  orders: defineTable({
    // Customer Info
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerTelegram: v.optional(v.string()),
    
    // Order Details
    orderNumber: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("printing"),
      v.literal("finished"),
      v.literal("delivered")
    ),
    
    // Parts in Order
    parts: v.array(v.object({
      partId: v.id("parts"),
      partName: v.string(),
      quantity: v.number(),
      priceAtOrder: v.number(),
    })),
    
    // Financials
    subtotal: v.number(),
    markup: v.number(),
    total: v.number(),
    
    // Dates
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    estimatedCompletion: v.optional(v.number()),
    
    // Notes
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_customer", ["customerName"])
    .index("by_date", ["createdAt"]),

  // Parts Catalog Table
  parts: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    
    // Photo
    photoId: v.optional(v.id("_storage")),
    photoUrl: v.optional(v.string()),
    
    // Print Parameters
    materialId: v.id("materials"),
    weightGrams: v.number(),
    printTimeMinutes: v.number(),
    
    // Calculated Cost
    materialCost: v.number(),
    printCost: v.number(),
    baseCost: v.number(),
    
    // Pricing
    defaultMarkupPercent: v.number(),
    suggestedPrice: v.number(),
    
    // Metadata
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_material", ["materialId"])
    .index("by_name", ["name"])
    .searchIndex("search_parts", {
      searchField: "name",
      filterFields: ["materialId", "category"]
    }),

  // Materials Table
  materials: defineTable({
    name: v.string(),
    type: v.string(),
    color: v.optional(v.string()),
    brand: v.optional(v.string()),
    
    // Cost
    costPerGram: v.number(),
    
    // Inventory
    currentStockGrams: v.number(),
    lowStockThreshold: v.number(),
    
    // Properties
    printTempMin: v.optional(v.number()),
    printTempMax: v.optional(v.number()),
    bedTempMin: v.optional(v.number()),
    bedTempMax: v.optional(v.number()),
    
    // Metadata
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_name", ["name"]),

  // Printers Table
  printers: defineTable({
    name: v.string(),
    model: v.optional(v.string()),
    
    // Cost Settings
    hourlyRate: v.number(),
    powerConsumptionWatts: v.number(),
    electricityCostPerKwh: v.number(),
    
    // Tracking
    totalPrintHours: v.number(),
    totalPrintCount: v.number(),
    
    // Maintenance
    lastMaintenanceAt: v.optional(v.number()),
    maintenanceIntervalHours: v.number(),
    
    // Status
    isActive: v.boolean(),
    currentJobOrderId: v.optional(v.id("orders")),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"]),

  // Maintenance Log Table
  maintenanceLogs: defineTable({
    printerId: v.id("printers"),
    type: v.union(
      v.literal("cleaning"),
      v.literal("lubrication"),
      v.literal("belt_tension"),
      v.literal("nozzle_change"),
      v.literal("bed_leveling"),
      v.literal("firmware_update"),
      v.literal("other")
    ),
    description: v.string(),
    hoursAtMaintenance: v.number(),
    cost: v.optional(v.number()),
    performedAt: v.number(),
    nextDueAt: v.optional(v.number()),
  })
    .index("by_printer", ["printerId"])
    .index("by_date", ["performedAt"]),

  // Inventory Transactions
  inventoryTransactions: defineTable({
    materialId: v.id("materials"),
    type: v.union(
      v.literal("purchase"),
      v.literal("consumption"),
      v.literal("adjustment"),
      v.literal("waste")
    ),
    amountGrams: v.number(),
    orderId: v.optional(v.id("orders")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_material", ["materialId"])
    .index("by_order", ["orderId"])
    .index("by_date", ["createdAt"]),

  // User Settings Table
  userSettings: defineTable({
    // Localization
    language: v.union(v.literal("en"), v.literal("ru")),
    currency: v.union(
      v.literal("RUB"),
      v.literal("USD"),
      v.literal("EUR"),
      v.literal("CNY")
    ),
    
    // Display Preferences
    theme: v.literal("dark"),
    
    // Business Settings
    defaultMarkupPercent: v.number(),
    taxRate: v.optional(v.number()),
    
    // Telegram Integration
    telegramChatId: v.optional(v.string()),
    telegramNotificationsEnabled: v.boolean(),
    
    // Notification Preferences
    notifyOnNewOrder: v.boolean(),
    notifyOnStatusChange: v.boolean(),
    notifyOnLowStock: v.boolean(),
    
    updatedAt: v.number(),
  }),

  // Exchange Rates Cache
  exchangeRates: defineTable({
    baseCurrency: v.literal("RUB"),
    rates: v.object({
      USD: v.number(),
      EUR: v.number(),
      CNY: v.number(),
    }),
    fetchedAt: v.number(),
  }),
});
