export interface CloudContext {
  subscriptionId?: string;
  environmentId?: string;
  cliUrl?: string;
}

class ContextStore {
  private ctx: CloudContext = {};

  setContext(partial: CloudContext): CloudContext {
    this.ctx = { ...this.ctx, ...partial };
    // If cliUrl is set, update the environment variable
    if (partial.cliUrl !== undefined) {
      process.env.LC_CLI_URL = partial.cliUrl;
    }
    return this.ctx;
  }

  getContext(): CloudContext {
    return { ...this.ctx };
  }

  getCliUrl(): string | undefined {
    return this.ctx.cliUrl || process.env.LC_CLI_URL;
  }
}

export const contextStore = new ContextStore();
