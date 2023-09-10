import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { getOrCreateMetric, getToken } from "./utils";
import {PrometheusOptions, PrometheusPrefix} from "../interfaces";
import {PROM_CONFIG, PROMETHEUS_OPTIONS} from "../constants";

/**
 * @public
 */
export function makeSummaryProvider(
  options: client.SummaryConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(config: PrometheusPrefix): client.Metric<string> {
      options.name = config.prefix.concat(options.name);
      return getOrCreateMetric("Summary", options);
    },
    inject: [PROM_CONFIG]
  };
}
