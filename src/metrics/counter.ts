import {Provider} from "@nestjs/common";
import * as client from "prom-client";
import {getOrCreateMetric, getToken} from "./utils";
import {PROM_CONFIG} from "../constants";
import {PrometheusPrefix} from "../interfaces";

/**
 * @public
 */
export function makeCounterProvider(
  options: client.CounterConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory(config: PrometheusPrefix): client.Metric<string> {
      options.name = config.prefix.concat(options.name);
      return getOrCreateMetric("Counter", options);
    },
      inject: [PROM_CONFIG]
  };
}
