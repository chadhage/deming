import { describe, it, expect } from "vitest";
import {
  cd3,
  wsjf,
  forceRank,
  iinvest,
  type WorkItem
} from "../src/core/prioritization.js";

describe("CD3", () => {
  it("computes cost of delay divided by duration", () => {
    expect(cd3({ costOfDelay: 20, duration: 4 })).toBe(5);
  });
  it("throws on non-positive duration", () => {
    expect(() => cd3({ costOfDelay: 1, duration: 0 })).toThrow();
  });
});

describe("WSJF", () => {
  it("sums cost-of-delay components over job size", () => {
    expect(
      wsjf({
        userBusinessValue: 5,
        timeCriticality: 3,
        riskReductionOpportunityEnablement: 2,
        jobSize: 2
      })
    ).toBe(5);
  });
  it("throws on non-positive job size", () => {
    expect(() =>
      wsjf({
        userBusinessValue: 1,
        timeCriticality: 1,
        riskReductionOpportunityEnablement: 1,
        jobSize: 0
      })
    ).toThrow();
  });
});

describe("forceRank", () => {
  it("orders by CD3 descending and breaks ties by id", () => {
    const items: WorkItem[] = [
      { id: "b", title: "b", costOfDelay: 10, duration: 10 }, // 1.0
      { id: "a", title: "a", costOfDelay: 10, duration: 10 }, // 1.0 tie
      { id: "c", title: "c", costOfDelay: 30, duration: 10 } // 3.0
    ];
    expect(forceRank(items).map((i) => i.id)).toEqual(["c", "a", "b"]);
  });
});

describe("IINVEST", () => {
  const pass = {
    independent: true,
    immediate: true,
    negotiated: true,
    valuable: true,
    estimated: true,
    sized: true,
    testable: true
  };
  it("passes when all criteria met", () => {
    expect(iinvest(pass)).toEqual({ pass: true, failed: [] });
  });
  it("fails and reports missing criteria", () => {
    const result = iinvest({ ...pass, testable: false, sized: false });
    expect(result.pass).toBe(false);
    expect(result.failed).toContain("testable");
    expect(result.failed).toContain("sized");
  });
});
