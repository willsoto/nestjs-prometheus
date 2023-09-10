import {Provider} from "@nestjs/common";
import * as client from "prom-client";
import {getOrCreateMetric, getToken} from "./utils";
import {PrometheusPrefix} from "../interfaces";
import {PROM_CONFIG} from "../constants";

/**
 * @public
 */
export function makeHistogramProvider(
  options: client.HistogramConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(config: PrometheusPrefix): client.Metric<string> {
      options.name = config.prefix.concat(options.name);
      return getOrCreateMetric("Histogram", options);
    },
    inject: [PROM_CONFIG]
  };
}
