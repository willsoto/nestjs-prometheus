import { Controller, Get } from "@nestjs/common";
import { Counter, Gauge } from "prom-client";
import { InjectMetric } from "../../src";

@Controller("/resource")
export class ResourceController {
  constructor(
    @InjectMetric("counter") public counter: Counter<string>,
    @InjectMetric("gauge") public gauge: Gauge<string>,
  ) {}

  @Get("/counter")
  counterMetric() {
    this.counter.inc();
    return this.counter.get();
  }

  @Get("/gauge")
  gaugeMetric() {
    this.gauge.inc();
    return this.gauge.get();
  }
}
