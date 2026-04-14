import { v } from "convex/values";
import { internalQuery, query } from "./_generated/server";

export const getFileMetadata = internalQuery({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.system.get("_storage", args.storageId);
  },
});

export const listAllFiles = internalQuery({
  args: {},
  handler: async (ctx) => {
    // You can use .paginate() as well
    return await ctx.db.system.query("_storage").collect();
  },
});