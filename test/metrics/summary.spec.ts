import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { getToken, makeSummaryProvider } from "../../src";
import { PROMETHEUS_OPTIONS } from "../../src/constants";

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
        {
          provide: PROMETHEUS_OPTIONS,
          useValue: {
            customMetricPrefix: "app",
          },
        },
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

  it("name has the prefix of APP", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();

    expect(metricValues.name).to.eq("app_controller_summary");
  });
});
