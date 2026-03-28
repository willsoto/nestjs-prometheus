import { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import { register } from "prom-client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { CorePrefixModule } from "./fixtures/core-prefix.module";
import { CoreModule } from "./fixtures/core.module";
import { ResourceController } from "./fixtures/resource.controller";

describe("End-to-end", function () {
  let app: NestExpressApplication;

  afterAll(async function () {
    register.clear();
    await app.close();
  });

  describe("when all metrics are not prefixed", function () {
    beforeAll(async function () {
      const testingModule = await Test.createTestingModule({
        imports: [CoreModule],
        controllers: [ResourceController],
      }).compile();

      app = testingModule.createNestApplication<NestExpressApplication>();
      await app.init();
    });

    it("should return metrics", async function () {
      const response = await request(app.getHttpServer()).get("/metrics");

      expect(response.status).toEqual(200);

      expect(response.text).toContain("counter");
      expect(response.text).toContain("gauge");
      expect(response.text).toContain("histogram");
      expect(response.text).toContain("summary");
    });

    it("should be able to incremement the counter", async function () {
      const response = await request(app.getHttpServer()).get("/resource/counter");

      expect(response.status).toEqual(200);
      expect(response.text).toBe(
        JSON.stringify({
          help: "counter helper",
          name: "counter",
          type: "counter",
          values: [{ value: 1, labels: {} }],
          aggregator: "sum",
        }),
      );
    });

    it("should be able to incremement the gauge", async function () {
      const response = await request(app.getHttpServer()).get("/resource/gauge");

      expect(response.status).toEqual(200);
      expect(response.text).toBe(
        JSON.stringify({
          help: "gauge helper",
          name: "gauge",
          type: "gauge",
          values: [{ value: 1, labels: {} }],
          aggregator: "sum",
        }),
      );
    });
  });

  describe("when all metrics are prefixed", function () {
    beforeAll(async function () {
      const testingModule = await Test.createTestingModule({
        imports: [CorePrefixModule],
        controllers: [ResourceController],
      }).compile();

      app = testingModule.createNestApplication();
      await app.init();
    });

    it("should return metrics", async function () {
      const response = await request(app.getHttpServer()).get("/metrics");

      expect(response.status).toEqual(200);

      expect(response.text).toContain("app_counter");
      expect(response.text).toContain("app_gauge");
      expect(response.text).toContain("app_histogram");
      expect(response.text).toContain("app_summary");
    });

    it("should be able to incremement the counter", async function () {
      const response = await request(app.getHttpServer()).get("/resource/counter");

      expect(response.status).toEqual(200);
      expect(response.text).toBe(
        JSON.stringify({
          help: "counter helper",
          name: "app_counter",
          type: "counter",
          values: [{ value: 1, labels: {} }],
          aggregator: "sum",
        }),
      );
    });

    it("should be able to incremement the gauge", async function () {
      const response = await request(app.getHttpServer()).get("/resource/gauge");

      expect(response.status).toEqual(200);
      expect(response.text).toBe(
        JSON.stringify({
          help: "gauge helper",
          name: "app_gauge",
          type: "gauge",
          values: [{ value: 1, labels: {} }],
          aggregator: "sum",
        }),
      );
    });
  });
});
