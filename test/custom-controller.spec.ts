import { Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { register } from "prom-client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PrometheusController } from "../src";
import {
  Agent,
  App,
  createAsyncPrometheusModule,
  createPrometheusModule,
} from "./utils";

describe("PrometheusModule with a custom controller", function () {
  let agent: Agent;
  let app: App;
  let fake: ReturnType<typeof vi.fn<() => void>>;

  afterEach(async function () {
    register.clear();
    await app.close();
  });

  it("registers a /metrics endpoint (sync)", async function () {
    fake = vi.fn();

    class CustomController extends PrometheusController {
      @Get()
      async index(@Res() response: Response): Promise<string> {
        fake();
        return super.index(response);
      }
    }

    ({ agent, app } = await createPrometheusModule({
      controller: CustomController,
    }));

    const response = await agent.get("/metrics");

    expect(response).toHaveProperty("status", 200);
    expect(fake).toHaveBeenCalledTimes(1);

    expect(response.text).toContain("process_cpu_user_seconds_total");
  });

  it("registers a /metrics endpoint (async)", async function () {
    fake = vi.fn();

    class CustomController extends PrometheusController {
      @Get()
      async index(@Res() response: Response): Promise<string> {
        fake();
        return super.index(response);
      }
    }

    ({ agent, app } = await createAsyncPrometheusModule({
      controller: CustomController,
      useFactory() {
        return {};
      },
    }));

    const response = await agent.get("/metrics");

    expect(response).toHaveProperty("status", 200);
    expect(fake).toHaveBeenCalledTimes(1);

    expect(response.text).toContain("process_cpu_user_seconds_total");
  });
});
