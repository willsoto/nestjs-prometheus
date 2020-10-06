import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import client from "prom-client";
import { getToken, makeSummaryProvider } from "../../src";

describe("Summary", function () {
  let testingModule: TestingModule;
  let metric: client.Summary<string>;

  beforeEach(async function () {
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

  afterEach(async function () {
    await testingModule.close();
  });

  it("creates a Summary", function () {
    expect(metric).to.be.instanceOf(client.Summary);
  });

  it("has the appropriate methods (observe)", function () {
    expect(metric.observe).to.be.a("function");
  });
});
