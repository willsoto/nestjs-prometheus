import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as client from "prom-client";

@Controller()
export class PrometheusController {
  @Get()
  index(@Res() response: Response): void {
    if (response.set) {
      response.set("Content-Type", client.register.contentType);
      response.end(client.register.metrics());
    } else {
      response.type(client.register.contentType);
      response.send(client.register.metrics());
    }
  }
}
