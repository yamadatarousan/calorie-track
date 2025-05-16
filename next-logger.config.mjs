import pino from "pino";

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    level: "debug", // デバッグログも出力
    base: { pid: process.pid, hostname: process.env.HOSTNAME }, // メタデータ
    timestamp: pino.stdTimeFunctions.isoTime, // ISO タイムスタンプ
    // トランスポートをシンプルに
    transport: {
      target: "pino/file",
      options: { destination: "./logs/app.log", mkdir: true }, // ディレクトリ自動作成
    },
  });

export { logger };