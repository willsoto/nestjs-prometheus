import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as client from "prom-client";

@Controller()
export class PrometheusController {
  @Get()
  index(@Res() response: Response): void {
    response.header("Content-Type", client.register.contentType);
    response.send(client.register.metrics());
  }
}
