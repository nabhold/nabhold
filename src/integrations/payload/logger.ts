/**
 * Structured, server-only logging for the Payload boundary. Never includes
 * raw upstream error bodies or credentials — only what is safe to appear in
 * infrastructure logs (ADR-0002 resilience requirements).
 */
type LogLevel = "info" | "warn" | "error";

interface LogFields {
  operation: string;
  reason?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, fields: LogFields): void {
  const entry = {
    boundary: "payload",
    level,
    timestamp: new Date().toISOString(),
    ...fields,
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export const payloadLogger = {
  /** A collection or document does not exist yet upstream — expected during rollout. */
  contentUnavailable(fields: LogFields): void {
    log("info", fields);
  },
  /** A genuine transport/validation failure. The caller still degrades gracefully. */
  degraded(fields: LogFields): void {
    log("warn", fields);
  },
};
