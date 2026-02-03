import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("materials").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    color: v.optional(v.string()),
    brand: v.optional(v.string()),
    costPerGram: v.number(),
    currentStockGrams: v.number(),
    lowStockThreshold: v.number(),
    printTempMin: v.optional(v.number()),
    printTempMax: v.optional(v.number()),
    bedTempMin: v.optional(v.number()),
    bedTempMax: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("materials", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("materials"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    color: v.optional(v.string()),
    brand: v.optional(v.string()),
    costPerGram: v.optional(v.number()),
    currentStockGrams: v.optional(v.number()),
    lowStockThreshold: v.optional(v.number()),
    printTempMin: v.optional(v.number()),
    printTempMax: v.optional(v.number()),
    bedTempMin: v.optional(v.number()),
    bedTempMax: v.optional(v.number()),
    notes: v.optional(v.string()),
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
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const materials = await ctx.db.query("materials").collect();
    return materials.filter(
      (m) => m.currentStockGrams <= m.lowStockThreshold
    );
  },
});
