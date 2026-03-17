/**
 * Simple logger utility for API routes
 */

type LogLevel = "info" | "error" | "warn" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  path?: string;
  method?: string;
  status?: number;
  duration?: number;
  message: string;
  data?: unknown;
}

function formatLog(entry: LogEntry): string {
  const { timestamp, level, path, method, status, duration, message, data } =
    entry;
  const levelUpper = level.toUpperCase().padEnd(6);

  let log = `[${timestamp}] ${levelUpper}`;

  if (method && path) {
    log += ` ${method.padEnd(6)} ${path}`;
  }

  if (status) {
    const statusColor = status >= 400 ? "❌" : status >= 300 ? "⚠️" : "✅";
    log += ` ${statusColor} ${status}`;
  }

  if (duration) {
    log += ` (${duration}ms)`;
  }

  log += ` | ${message}`;

  if (data) {
    log += ` | Data: ${JSON.stringify(data)}`;
  }

  return log;
}

export const logger = {
  info: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      data,
    };
    console.log(formatLog(entry));
  },

  error: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      data,
    };
    console.error(formatLog(entry));
  },

  warn: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      data,
    };
    console.warn(formatLog(entry));
  },

  debug: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "debug",
      message,
      data,
    };
    console.log(formatLog(entry));
  },

  request: (method: string, path: string, params?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      method,
      path,
      message: "Incoming request",
      data: params,
    };
    console.log(formatLog(entry));
  },

  response: (
    method: string,
    path: string,
    status: number,
    duration: number,
    message?: string,
  ) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: status >= 400 ? "error" : "info",
      method,
      path,
      status,
      duration,
      message: message || "Response sent",
    };
    console.log(formatLog(entry));
  },
};
