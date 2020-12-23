import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeCounterProvider(
  options: client.CounterConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): client.Metric<string> {
      return getOrCreateMetric("Counter", options);
    },
  };
}
