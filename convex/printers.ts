import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("printers").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("printers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    model: v.optional(v.string()),
    hourlyRate: v.number(),
    powerConsumptionWatts: v.number(),
    electricityCostPerKwh: v.number(),
    maintenanceIntervalHours: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("printers", {
      ...args,
      totalPrintHours: 0,
      totalPrintCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("printers"),
    name: v.optional(v.string()),
    model: v.optional(v.string()),
    hourlyRate: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
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
  args: { id: v.id("printers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
