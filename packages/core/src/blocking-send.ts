import type { RuntimeTransport, StatusFrame } from "./contracts.js";

export interface BlockingSendRequest {
  transport: RuntimeTransport;
  payload: Uint8Array;
  timeoutMs: number;
  pollIntervalMs?: number;
}

export interface BlockingSendResult {
  completed: boolean;
  ambiguous: boolean;
  finalStatus: StatusFrame | undefined;
}

export async function sendBlocking(
  request: BlockingSendRequest
): Promise<BlockingSendResult> {
  const pollIntervalMs = request.pollIntervalMs ?? 20;
  const start = Date.now();

  await request.transport.connect();
  await request.transport.write({
    data: request.payload,
    timeoutMs: request.timeoutMs
  });

  let lastStatus: StatusFrame | undefined;
  while (Date.now() - start < request.timeoutMs) {
    const raw = await request.transport.read({ timeoutMs: pollIntervalMs });
    lastStatus = decodeStatusFrame(raw);

    if (
      lastStatus.phaseType === "completed" &&
      lastStatus.statusType === "ok"
    ) {
      return { completed: true, ambiguous: false, finalStatus: lastStatus };
    }
    if (lastStatus.phaseType === "error") {
      return { completed: false, ambiguous: false, finalStatus: lastStatus };
    }
  }

  return { completed: false, ambiguous: true, finalStatus: lastStatus };
}

export function decodeStatusFrame(raw: Uint8Array): StatusFrame {
  const phase = raw[0];
  const status = raw[1];
  const frame: StatusFrame = {
    phaseType:
      phase === 2
        ? "completed"
        : phase === 1
          ? "printing"
          : phase === 255
            ? "error"
            : "waiting",
    statusType:
      status === 0
        ? "ok"
        : status === 1
          ? "cover-open"
          : status === 2
            ? "media-empty"
            : "generic-error",
    raw
  };

  if (raw[2] !== undefined) {
    frame.errorCode = raw[2];
  }

  return frame;
}
