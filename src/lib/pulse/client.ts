import { z } from "zod";

import {
  opportunitySchema,
  signalSchema,
  type ExecutiveOverview,
} from "./types";

const schema = z.object({
  signals: z.array(signalSchema),
  opportunities: z.array(opportunitySchema),
  generatedAt: z.string(),
});

const DEFAULT_TIMEOUT_MS = 5_000;

export class PulseUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PulseUnavailableError";
  }
}

function requestTimeout(): number {
  const configured = Number(process.env.BAOBAB_PULSE_TIMEOUT_MS);

  return Number.isInteger(configured) && configured > 0
    ? configured
    : DEFAULT_TIMEOUT_MS;
}

export async function getExecutiveOverview(): Promise<ExecutiveOverview> {
  const endpoint = process.env.BAOBAB_PULSE_API_URL;
  const token = process.env.BAOBAB_PULSE_API_TOKEN;

  if (!endpoint || !token) {
    throw new PulseUnavailableError("Pulse is not configured");
  }

  let response: Response;

  try {
    response = await fetch(`${endpoint}/v1/executive-overview`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeout()),
    });
  } catch (error) {
    throw new PulseUnavailableError("Pulse request failed", { cause: error });
  }

  if (!response.ok) {
    throw new PulseUnavailableError(`Pulse returned ${response.status}`);
  }

  return schema.parse(await response.json());
}
