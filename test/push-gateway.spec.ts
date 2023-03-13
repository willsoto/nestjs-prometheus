import { Injectable, Module } from "@nestjs/common";
import { expect } from "chai";
import { Pushgateway, register } from "prom-client";
import { PrometheusOptions, PrometheusOptionsFactory } from "../src";
import { createAsyncPrometheusModule, createPrometheusModule } from "./utils";

describe("Pushgateway", function () {
  @Injectable()
  class OptionsService implements PrometheusOptionsFactory {
    createPrometheusOptions(): PrometheusOptions | Promise<PrometheusOptions> {
      return {
        pushgateway: {
          url: "http://127.0.0.1:9091",
        },
      };
    }
  }

  @Module({
    providers: [OptionsService],
    exports: [OptionsService],
  })
  class OptionsModule {}

  afterEach(function () {
    register.clear();
  });

  it("should register a pushgateway if options are provided (sync)", async function () {
    const { testingModule, app } = await createPrometheusModule({
      pushgateway: {
        url: "http://127.0.0.1:9091",
      },
    });
    const gateway = testingModule.get(Pushgateway);

    expect(gateway).to.be.instanceOf(Pushgateway);

    await app.close();
  });

  it("should register a pushgateway if options are provided (async)", async function () {
    const { testingModule, app } = await createAsyncPrometheusModule({
      imports: [OptionsModule],
      useExisting: OptionsService,
      inject: [OptionsService],
    });
    const gateway = testingModule.get(Pushgateway);

    expect(gateway).to.be.instanceOf(Pushgateway);

    await app.close();
  });
});
