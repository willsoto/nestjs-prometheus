import { expect } from "chai";
import { Agent, App, createTestingModule } from "./utils";

describe("PrometheusModule", function() {
  let agent: Agent;
  let app: App;

  afterEach(async function() {
    if (app) {
      await app.close();
    }
  });

  describe("#forRoot", function() {
    describe("with all defaults", function() {
      beforeEach(async function() {
        ({ agent, app } = await createTestingModule());
      });

      it("registers a /metrics endpoint", async function() {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("status")
          .to.eql(200);
      });

      it("collects default metrics", async function() {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
      });
    });

    describe("when overriding the default path", function() {
      beforeEach(async function() {
        ({ agent, app } = await createTestingModule({
          path: "/my-custom-endpoint",
        }));
      });

      it("does not register the default endpoint", async function() {
        const response = await agent.get("/metrics");

        expect(response)
          .to.have.property("status")
          .to.eql(404);
      });

      it("registers the custom endpoint", async function() {
        const response = await agent.get("/my-custom-endpoint");

        expect(response)
          .to.have.property("status")
          .to.eql(200);
      });

      it("collects default metrics", async function() {
        const response = await agent.get("/my-custom-endpoint");

        expect(response)
          .to.have.property("text")
          .to.contain("process_cpu_user_seconds_total");
      });
    });
  });
});
