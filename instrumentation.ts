export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      console.log("Starting next-logger initialization");
      await import("pino");
      const loggerModule = await import("next-logger");
      console.log("next-logger loaded:", loggerModule);
      console.log("Pino logger initialized");
    }
}