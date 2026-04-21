import { listLabels, listModels } from "@brother-ql/core";

export const CLI_PACKAGE_NAME = "@brother-ql/cli";

export interface CliRunResult {
  exitCode: number;
  output: string;
}

export interface CliRuntime {
  print(input: { model: string; printer: string }): string;
  send(input: { printer: string }): string;
  discover(input: { backend: string }): string;
}

function defaultRuntime(): CliRuntime {
  return {
    print: ({ model, printer }) => `print queued for ${model} via ${printer}`,
    send: ({ printer }) => `raw command sent to ${printer}`,
    discover: ({ backend }) => `discover completed for backend ${backend}`
  };
}

function readGlobalConfig(env: Record<string, string | undefined>) {
  return {
    backend: env.BROTHER_QL_BACKEND ?? "network",
    model: env.BROTHER_QL_MODEL ?? "QL-710W",
    printer: env.BROTHER_QL_PRINTER ?? "tcp://127.0.0.1:9100"
  };
}

export function runCli(
  args: string[],
  options: {
    env?: Record<string, string | undefined>;
    runtime?: CliRuntime;
  } = {}
): CliRunResult {
  const env = options.env ?? process.env;
  const runtime = options.runtime ?? defaultRuntime();
  const config = readGlobalConfig(env);
  const [command, subcommand] = args;

  if (command === "print") {
    return {
      exitCode: 0,
      output: runtime.print({ model: config.model, printer: config.printer })
    };
  }
  if (command === "send") {
    return { exitCode: 0, output: runtime.send({ printer: config.printer }) };
  }
  if (command === "discover") {
    return {
      exitCode: 0,
      output: runtime.discover({ backend: config.backend })
    };
  }
  if (command === "info" && subcommand === "models") {
    return {
      exitCode: 0,
      output: listModels()
        .map((model) => model.identifier)
        .join("\n")
    };
  }
  if (command === "info" && subcommand === "labels") {
    return {
      exitCode: 0,
      output: listLabels()
        .map((label) => label.identifier)
        .join("\n")
    };
  }
  if (command === "info" && subcommand === "env") {
    return {
      exitCode: 0,
      output: [
        `backend=${config.backend}`,
        `model=${config.model}`,
        `printer=${config.printer}`
      ].join("\n")
    };
  }

  return {
    exitCode: 1,
    output:
      "Usage: print | send | discover | info models | info labels | info env"
  };
}
