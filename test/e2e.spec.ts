import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { expect } from "chai";
import { register } from "prom-client";
import * as request from "supertest";
import { CorePrefixModule } from "./fixtures/core-prefix.module";
import { CoreModule } from "./fixtures/core.module";
import { ResourceController } from "./fixtures/resource.controller";

describe("End-to-end", function () {
  let app: INestApplication;

  after(async function () {
    register.clear();
    await app.close();
  });

  describe("when all metrics are not prefixed", function () {
    before(async function () {
      const testingModule = await Test.createTestingModule({
        imports: [CoreModule],
        controllers: [ResourceController],
      }).compile();

      app = testingModule.createNestApplication();
      await app.init();
    });

    it("should return metrics", async function () {
      const response = await request(app.getHttpServer()).get("/metrics");

      expect(response.status).to.eql(200);

      expect(response.text).to.contain("counter");
      expect(response.text).to.contain("gauge");
      expect(response.text).to.contain("histogram");
      expect(response.text).to.contain("summary");
    });

    it("should be able to incremement the counter", async function () {
      const response = await request(app.getHttpServer()).get(
        "/resource/counter",
      );

      expect(response.status).to.eql(200);
      expect(response.text).to.eq(
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
      const response = await request(app.getHttpServer()).get(
        "/resource/gauge",
      );

      expect(response.status).to.eql(200);
      expect(response.text).to.eq(
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
    before(async function () {
      const testingModule = await Test.createTestingModule({
        imports: [CorePrefixModule],
        controllers: [ResourceController],
      }).compile();

      app = testingModule.createNestApplication();
      await app.init();
    });

    it("should return metrics", async function () {
      const response = await request(app.getHttpServer()).get("/metrics");

      expect(response.status).to.eql(200);

      expect(response.text).to.contain("app_counter");
      expect(response.text).to.contain("app_gauge");
      expect(response.text).to.contain("app_histogram");
      expect(response.text).to.contain("app_summary");
    });

    it("should be able to incremement the counter", async function () {
      const response = await request(app.getHttpServer()).get(
        "/resource/counter",
      );

      expect(response.status).to.eql(200);
      expect(response.text).to.eq(
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
      const response = await request(app.getHttpServer()).get(
        "/resource/gauge",
      );

      expect(response.status).to.eql(200);
      expect(response.text).to.eq(
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
