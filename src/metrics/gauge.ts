import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { getOrCreateMetric, getToken } from "./utils";

export function makeGaugeProvider(
  options: client.GaugeConfiguration,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): client.Metric {
      return getOrCreateMetric("Gauge", options);
    },
  };
}
