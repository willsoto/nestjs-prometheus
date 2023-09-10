import {Provider} from "@nestjs/common";
import * as client from "prom-client";
import {getOrCreateMetric, getToken} from "./utils";
import {PrometheusPrefix} from "../interfaces";
import {PROM_CONFIG} from "../constants";

/**
 * @public
 */
export function makeGaugeProvider(
  options: client.GaugeConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(config: PrometheusPrefix): client.Metric<string> {
      options.name = config.prefix.concat(options.name);
      return getOrCreateMetric("Gauge", options);
    },
    inject: [PROM_CONFIG]
  };
}
