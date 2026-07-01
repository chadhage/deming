/**
 * Prioritization & commitment-gating helpers (contract §5).
 * Pure functions — the testable heart of the Deming agent.
 */

export interface WorkItem {
  id: string;
  title: string;
  /** Relative cost-of-delay (business value + time criticality + risk/opportunity). */
  costOfDelay: number;
  /** Job size / duration estimate (> 0). */
  duration: number;
}

/** CD3 = Cost of Delay / Duration. Higher is more urgent. */
export function cd3(item: Pick<WorkItem, "costOfDelay" | "duration">): number {
  if (item.duration <= 0) {
    throw new Error("duration must be greater than 0");
  }
  return item.costOfDelay / item.duration;
}

/**
 * WSJF = Cost of Delay / Job Size. With our model duration is the job-size proxy,
 * so WSJF and CD3 share a denominator but WSJF decomposes cost of delay explicitly.
 */
export interface WsjfInput {
  userBusinessValue: number;
  timeCriticality: number;
  riskReductionOpportunityEnablement: number;
  jobSize: number;
}

export function wsjf(input: WsjfInput): number {
  if (input.jobSize <= 0) {
    throw new Error("jobSize must be greater than 0");
  }
  const cod =
    input.userBusinessValue +
    input.timeCriticality +
    input.riskReductionOpportunityEnablement;
  return cod / input.jobSize;
}

/** Force-rank a backlog by CD3 descending (stable for ties by id). */
export function forceRank<T extends WorkItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const diff = cd3(b) - cd3(a);
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}

/** IINVEST — absolute pass/fail gate for committing a work item (contract §5). */
export interface IinvestChecklist {
  independent: boolean;
  immediate: boolean;
  negotiated: boolean;
  valuable: boolean;
  estimated: boolean;
  sized: boolean;
  testable: boolean;
}

export interface IinvestResult {
  pass: boolean;
  failed: string[];
}

export function iinvest(checklist: IinvestChecklist): IinvestResult {
  const failed = Object.entries(checklist)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  return { pass: failed.length === 0, failed };
}
