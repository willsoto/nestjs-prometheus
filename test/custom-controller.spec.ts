import { Get, Res } from "@nestjs/common";
import { expect } from "chai";
import { Response } from "express";
import { register } from "prom-client";
import * as sinon from "sinon";
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
  let fake: sinon.SinonSpy;

  afterEach(async function () {
    register.clear();
    await app.close();
  });

  it("registers a /metrics endpoint (sync)", async function () {
    fake = sinon.fake();

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

    expect(response).to.have.property("status").to.eql(200);
    expect(fake).to.have.been.calledOnce;

    expect(response)
      .to.have.property("text")
      .to.contain("process_cpu_user_seconds_total");
  });

  it("registers a /metrics endpoint (async)", async function () {
    fake = sinon.fake();

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

    expect(response).to.have.property("status").to.eql(200);
    expect(fake).to.have.been.calledOnce;

    expect(response)
      .to.have.property("text")
      .to.contain("process_cpu_user_seconds_total");
  });
});
