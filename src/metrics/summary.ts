import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeSummaryProvider(
  options: client.SummaryConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(): client.Metric<string> {
      return getOrCreateMetric("Summary", options);
    },
  };
}
