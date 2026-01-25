// import accounts from "@/app/db/models/accounts";
// import { CronJob } from "cron";
// import { deletionQueue } from "@/app/queues/deletionQueue";

// export const functionToTriggerSchedule = () => {
// const AccDeletionScheduler = new CronJob(
//   "*/15 * * * *", // every 15 minutes...
//   async () => {
//     try {
//       const accountsToDelete = await accounts.find({ 'account.status': "DELETION_PENDING", 'account.scheduledDeletionAt': { $lte: new Date() } }).select("_id");

//       for (const account of accountsToDelete) {
//         await deletionQueue.add(
//           "account-deletion",
//           { userId: account._id },
//           {
//             jobId: `delete-user-${account._id}`, // prevents duplicates...
//             removeOnComplete: true,
//             attempts: 3
//           }
//         );
//       }

//       console.log(`[CRON] Enqueued ${accountsToDelete.length} user deletions`);
//     } catch (err) {
//       console.error("[CRON] User deletion scheduler failed", err);
//     }
//   },
//   null,
//   false, // do not start immediately
//   "UTC"
// );

//   AccDeletionScheduler.start();
// }
