import { ConnectionOptions, Queue } from "bullmq";

export const deletionQueue = new Queue("account-deletion", {
  connection: process.env.REDIS_URL as ConnectionOptions,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 3000 }
  }
});
