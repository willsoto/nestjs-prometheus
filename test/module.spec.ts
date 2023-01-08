import { Injectable, Module } from "@nestjs/common";
import { expect } from "chai";
import { register } from "prom-client";
import { PrometheusModule, PrometheusOptionsFactory } from "../src";
import {
  Agent,
  App,
  createAsyncPrometheusModule,
  createPrometheusModule,
} from "./utils";

describe("PrometheusModule", function () {
  let agent: Agent;
  let app: App;

  afterEach(async function () {
    if (app) {
      register.clear();
      await app.close();
    }
  });

  describe("#register", function () {
    describe("with all defaults", function () {
      beforeEach(async function () {
        ({ agent, app } = await createPrometheusModule());
      });

      it("registers a /metrics endpoint", async function () {
        const response = await agent.get("/metrics");

        expect(response).to.have.property("status").to.eql(200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
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

        expect(response).to.have.property("status").to.eql(404);
      });

      it("registers the custom endpoint", async function () {
        const response = await agent.get("/my-custom-endpoint");

        expect(response).to.have.property("status").to.eql(200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/my-custom-endpoint");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
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

        expect(response).to.have.property("status").to.eql(200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
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

        expect(response).to.have.property("status").to.eql(200);
      });

      it("collects default metrics", async function () {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
      });
    });
  });

  describe("#createAsyncOptionsProvider", function () {
    it("throws an error if useClass or useExisting are not provided", function () {
      expect(() => {
        PrometheusModule.createAsyncProviders({});
      }).to.throw(
        "Invalid configuration. Must provide useClass or useExisting",
      );
    });
  });

  describe("#createAsyncOptionsProvider", function () {
    it("throws an error if useClass or useExisting are not provided", function () {
      expect(() => {
        PrometheusModule.createAsyncOptionsProvider({});
      }).to.throw(
        "Invalid configuration. Must provide useClass or useExisting",
      );
    });
  });
});
