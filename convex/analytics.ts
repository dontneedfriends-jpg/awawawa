import { query } from "./_generated/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthStart = startOfMonth.getTime();

    // Get orders this month
    const allOrders = await ctx.db.query("orders").collect();
    const ordersThisMonth = allOrders.filter(
      (order) => order.createdAt >= monthStart
    );

    // Calculate revenue
    const revenueThisMonth = ordersThisMonth.reduce(
      (sum, order) => sum + order.total,
      0
    );

    // Calculate average order value
    const averageOrderValue =
      ordersThisMonth.length > 0
        ? revenueThisMonth / ordersThisMonth.length
        : 0;

    // Count parts
    const allParts = await ctx.db.query("parts").collect();
    const totalParts = allParts.length;

    // Orders by status
    const ordersByStatus = {
      new: allOrders.filter((o) => o.status === "new").length,
      printing: allOrders.filter((o) => o.status === "printing").length,
      finished: allOrders.filter((o) => o.status === "finished").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
    };

    return {
      ordersThisMonth: ordersThisMonth.length,
      revenueThisMonth,
      averageOrderValue,
      totalParts,
      ordersByStatus,
    };
  },
});
