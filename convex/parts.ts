import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    materialId: v.optional(v.id("materials")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("parts");
    
    if (args.materialId) {
      query = query.filter((q) => q.eq(q.field("materialId"), args.materialId));
    }
    
    return await query.order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("parts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    materialId: v.id("materials"),
    weightGrams: v.number(),
    printTimeMinutes: v.number(),
    defaultMarkupPercent: v.number(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Get material for cost calculation
    const material = await ctx.db.get(args.materialId);
    if (!material) throw new Error("Material not found");
    
    // Get first active printer for hourly rate
    const printers = await ctx.db.query("printers")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    const printerHourlyRate = printers?.hourlyRate ?? 100; // Default rate
    
    // Calculate costs
    const materialCost = args.weightGrams * material.costPerGram;
    const printCost = (args.printTimeMinutes / 60) * printerHourlyRate;
    const baseCost = materialCost + printCost;
    const suggestedPrice = baseCost * (1 + args.defaultMarkupPercent / 100);
    
    return await ctx.db.insert("parts", {
      name: args.name,
      description: args.description,
      materialId: args.materialId,
      weightGrams: args.weightGrams,
      printTimeMinutes: args.printTimeMinutes,
      materialCost,
      printCost,
      baseCost,
      defaultMarkupPercent: args.defaultMarkupPercent,
      suggestedPrice,
      category: args.category,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("parts"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    weightGrams: v.optional(v.number()),
    printTimeMinutes: v.optional(v.number()),
    defaultMarkupPercent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("parts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
