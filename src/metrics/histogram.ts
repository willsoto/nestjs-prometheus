import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeHistogramProvider(
  options: client.HistogramConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): client.Metric<string> {
      return getOrCreateMetric("Histogram", options);
    },
  };
}
