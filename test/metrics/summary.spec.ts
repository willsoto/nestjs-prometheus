import { Test, TestingModule } from "@nestjs/testing";
import { getToken, makeSummaryProvider } from "@src";
import { expect } from "chai";
import * as client from "prom-client";

describe("Summary", function() {
  let testingModule: TestingModule;
  let metric: client.Summary;

  beforeEach(async function() {
    testingModule = await Test.createTestingModule({
      providers: [
        makeSummaryProvider({
          name: "controller_summary",
          help: "controller_summary_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_summary"));
  });

  afterEach(async function() {
    await testingModule.close();
  });

  it("creates a Summary", function() {
    expect(metric).to.be.instanceOf(client.Summary);
  });

  it("has the appropriate methods (observe)", function() {
    expect(metric.observe).to.be.a("function");
  });
});
