export interface CloudContext {
  subscriptionId?: string;
  environmentId?: string;
}

class ContextStore {
  private ctx: CloudContext = {};

  setContext(partial: CloudContext): CloudContext {
    this.ctx = { ...this.ctx, ...partial };
    return this.ctx;
  }

  getContext(): CloudContext {
    return { ...this.ctx };
  }
}

export const contextStore = new ContextStore();
