import { startServer, stopServer } from './server'

process.on("SIGINT", () => stopServer("SIGINT"));
process.on("SIGTERM", () => stopServer("SIGTERM"));

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
})
