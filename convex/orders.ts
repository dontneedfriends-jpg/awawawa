import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("orders");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    let orders = await query.order("desc").collect();
    
    if (args.limit) {
      orders = orders.slice(0, args.limit);
    }
    
    return orders;
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerTelegram: v.optional(v.string()),
    parts: v.array(v.object({
      partId: v.id("parts"),
      quantity: v.number(),
    })),
    markup: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate order number
    const date = new Date(now);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const existingOrders = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("createdAt"), date.setHours(0, 0, 0, 0)))
      .collect();
    const orderNum = String(existingOrders.length + 1).padStart(3, "0");
    const orderNumber = `ORD-${dateStr}-${orderNum}`;
    
    // Get part details and calculate totals
    const partsWithDetails = await Promise.all(
      args.parts.map(async (p) => {
        const part = await ctx.db.get(p.partId);
        if (!part) throw new Error("Part not found");
        return {
          partId: p.partId,
          partName: part.name,
          quantity: p.quantity,
          priceAtOrder: part.suggestedPrice,
        };
      })
    );
    
    const subtotal = partsWithDetails.reduce(
      (sum, p) => sum + p.priceAtOrder * p.quantity,
      0
    );
    const markupAmount = subtotal * (args.markup / 100);
    const total = subtotal + markupAmount;
    
    return await ctx.db.insert("orders", {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      customerEmail: args.customerEmail,
      customerTelegram: args.customerTelegram,
      orderNumber,
      status: "new",
      parts: partsWithDetails,
      subtotal,
      markup: markupAmount,
      total,
      createdAt: now,
      notes: args.notes,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("new"),
      v.literal("printing"),
      v.literal("finished"),
      v.literal("delivered")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: any = { status: args.status };
    
    if (args.status === "printing") {
      updates.startedAt = now;
    } else if (args.status === "finished") {
      updates.finishedAt = now;
    } else if (args.status === "delivered") {
      updates.deliveredAt = now;
    }
    
    await ctx.db.patch(args.id, updates);
  },
});
