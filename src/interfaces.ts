import { Type } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import * as client from "prom-client";

/**
 * Options for the Prometheus Module
 */
export interface PrometheusOptions {
  /**
   * The URL at which Prometheus metrics will be available
   * @default /metrics
   */
  path?: string;
  /**
   * Configuration for the defaultMetrics collected by `prom-client`.
   */
  defaultMetrics?: {
    /**
     * Whether or not default metrics are collected.
     * @default true
     */
    enabled: boolean;
    /**
     * @see https://github.com/siimon/prom-client#default-metrics
     * @default {}
     */
    config?: client.DefaultMetricsCollectorConfiguration;
  };
}

export interface PrometheusOptionsFactory {
  createPrometheusOptions(): Promise<PrometheusOptions> | PrometheusOptions;
}

export interface PrometheusAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<PrometheusOptionsFactory>;
  useClass?: Type<PrometheusOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  /**
   * Not currently supported since there doesn't seem to be a way to get
   * the result of the function during configuration.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // useFactory?(...args: any[]): Promise<PrometheusOptions> | PrometheusOptions;
}
