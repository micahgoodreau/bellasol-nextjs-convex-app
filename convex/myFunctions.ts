import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, ActionCtx, internalAction, QueryCtx } from "./_generated/server";

export const doSomething = internalAction({
  args: {},
  handler: async (ctx) => {
    const filesToProcess = await listAllFiles(ctx);
    for (const file of filesToProcess) {
      const data = await getData(ctx, file._id);
      if (data) {
        const parsedData = JSON.parse(data);
        console.log(`Processing file with ID: ${file._id} and data:`, parsedData);
        await ctx.runMutation(internal.update.updateLeepaOwner, parsedData);
      } else {
        console.log(`No data found for file with ID: ${file._id}`);
      }
    }
  },
});

async function getData(ctx: ActionCtx, storageId: Id<"_storage"> = "kg205y9rzx65j2wqvb6df3btmn83skqr" as Id<"_storage">) {
    const blob = await ctx.storage.get(storageId);
    return await blob?.text();
}
async function listAllFiles(ctx: ActionCtx) {
  return await ctx.runQuery(internal.storageQueries.listAllFiles);
}