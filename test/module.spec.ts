import { Injectable, Module } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { Pushgateway, register } from "prom-client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  PrometheusModule,
  PrometheusOptions,
  PrometheusOptionsFactory,
} from "../src";
import {
  Agent,
  App,
  createAsyncPrometheusModule,
  createPrometheusModule,
} from "./utils";

describe("PrometheusModule", function () {
  let agent: Agent;
  let app: App;
  let testingModule: TestingModule;

  afterEach(async function () {
    register.clear();

    if (app) {
      await app.close();
    }

    if (testingModule) {
      await testingModule.close();
    }
  });

  describe("#register", function () {
    describe("with defaultLabels", function () {
      beforeEach(async function () {
        ({ agent, app } = await createPrometheusModule({
          defaultLabels: {
            app: "test",
          },
        }));
      });

      it("applies default labels to metrics", async function () {
        const response = await agent.get("/metrics");

        expect(response).toHaveProperty("status", 200);
        expect(response.text).toContain('app="test"');
      });
    });

    describe("with all defaults", function () {
      beforeEach(async function () {
        ({ agent, app } = await createPrometheusModule());
      });

      it("registers a /metrics endpoint", async function () {
        const response = await agent.get("/metrics");

        expect(response).toHaveProperty("status", 200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/metrics");

        expect(response.text).toContain("process_cpu_user_seconds_total");
      });
    });

    describe("when overriding the default path", function () {
      beforeEach(async function () {
        ({ agent, app } = await createPrometheusModule({
          path: "/my-custom-endpoint",
        }));
      });

      it("does not register the default endpoint", async function () {
        const response = await agent.get("/metrics");

        expect(response).toHaveProperty("status", 404);
      });

      it("registers the custom endpoint", async function () {
        const response = await agent.get("/my-custom-endpoint");

        expect(response).toHaveProperty("status", 200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/my-custom-endpoint");

        expect(response.text).toContain("process_cpu_user_seconds_total");
      });
    });
  });

  describe("#registerAsync", function () {
    @Injectable()
    class OptionsService implements PrometheusOptionsFactory {
      createPrometheusOptions() {
        return {};
      }
    }

    @Module({
      providers: [OptionsService],
      exports: [OptionsService],
    })
    class OptionsModule {}

    describe("useExisting", function () {
      beforeEach(async function () {
        ({ agent, app } = await createAsyncPrometheusModule({
          imports: [OptionsModule],
          useExisting: OptionsService,
          inject: [OptionsService],
        }));
      });

      it("registers a /metrics endpoint", async function () {
        const response = await agent.get("/metrics");

        expect(response).toHaveProperty("status", 200);
        expect(response.text).toContain("process_cpu_user_seconds_total");
      });
    });

    describe("useClass", function () {
      beforeEach(async function () {
        ({ agent, app } = await createAsyncPrometheusModule({
          useClass: OptionsService,
          inject: [OptionsService],
        }));
      });

      it("registers a /metrics endpoint", async function () {
        const response = await agent.get("/metrics");

        expect(response).toHaveProperty("status", 200);
        expect(response.text).toContain("process_cpu_user_seconds_total");
      });
    });

    describe("useFactory", function () {
      @Injectable()
      class MyConfigService {
        options(): PrometheusOptions {
          return {
            path: "/my/custom/path/metrics",
            pushgateway: {
              url: "http://127.0.0.1:9091",
            },
          };
        }
      }

      @Module({
        providers: [MyConfigService],
        exports: [MyConfigService],
      })
      class MyConfigModule {}

      beforeEach(async function () {
        ({ agent, app, testingModule } = await createAsyncPrometheusModule({
          imports: [MyConfigModule],
          inject: [MyConfigService],
          useFactory(config: MyConfigService) {
            return config.options();
          },
        }));
      });

      it("registers a custom endpoint", async function () {
        const response = await agent.get("/my/custom/path/metrics");

        expect(response).toHaveProperty("status", 200);
        expect(response.text).toContain("process_cpu_user_seconds_total");
      });

      it("should register the push gateway", function () {
        const gateway = testingModule.get(Pushgateway);

        expect(gateway).toBeInstanceOf(Pushgateway);
        expect(gateway).toHaveProperty("gatewayUrl", "http://127.0.0.1:9091");
      });
    });
  });

  describe("#createAsyncOptionsProvider", function () {
    it("throws an error if useClass or useExisting are not provided", function () {
      expect(() => {
        PrometheusModule.createAsyncProviders({});
      }).toThrow("Invalid configuration. Must provide useClass or useExisting");
    });
  });

  describe("#createAsyncOptionsProvider", function () {
    it("throws an error if useClass or useExisting are not provided", function () {
      expect(() => {
        PrometheusModule.createAsyncOptionsProvider({});
      }).toThrow("Invalid configuration. Must provide useClass or useExisting");
    });
  });
});
