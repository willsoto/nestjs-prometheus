import { Type } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import * as client from "prom-client";

/**
 * Configuration for the defaultMetrics collected by `prom-client`.
 *
 * @public
 */
export interface PrometheusDefaultMetrics {
  /**
   * Whether or not default metrics are collected.
   *
   * @defaultValue true
   */
  enabled: boolean;
  /**
   * {@link https://github.com/siimon/prom-client#default-metrics | Default Metrics}
   */
  config?: client.DefaultMetricsCollectorConfiguration;
}

/**
 * Options for the Prometheus Module.
 *
 * @public
 */
export interface PrometheusOptions {
  /**
   * A custom controller to be used instead of the default one. Only needs to be
   * provided if you need to do any kind of customization on the route, eg Swagger.
   *
   * You can use the {@link PrometheusController} as a base class.
   *
   * @example
   * ```
   * import { PrometheusController } from "@willsoto/nestjs-prometheus";
   * import { Controller, Get, Res } from "@nestjs/common";
   * import { Response } from "express";
   *
   * @Controller()
   * class MyCustomController extends PrometheusController {
   *   @Get()
   *   index(@Res({ passthrough: true }) response: Response) {
   *     return super.index(response);
   *   }
   * }
   * ```
   */
  controller?: Type<unknown>;
  /**
   * The URL at which Prometheus metrics will be available
   *
   * @defaultValue /metrics
   */
  path?: string;
  /** {@inheritDoc PrometheusDefaultMetrics} */
  defaultMetrics?: PrometheusDefaultMetrics;
  /**
   * Will be passed into `setDefaultLabels`
   *
   * {@link https://github.com/siimon/prom-client#default-labels-segmented-by-registry}
   */
  // Using this type to match what prom-client specifies.
  // eslint-disable-next-line @typescript-eslint/ban-types
  defaultLabels?: Object;
  pushgateway?: {
    url: string;
    options?: unknown;
    registry?: client.Registry;
  };
}

export type PrometheusOptionsWithDefaults = Required<
  Omit<PrometheusOptions, "pushgateway">
>;

/**
 * @internal
 */
export interface PrometheusOptionsFactory {
  createPrometheusOptions(): Promise<PrometheusOptions> | PrometheusOptions;
}

/**
 * Options for configuring a dynamic provider
 *
 * @public
 */
export interface PrometheusAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<PrometheusOptionsFactory>;
  useClass?: Type<PrometheusOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];

  /** {@inheritDoc PrometheusOptions.controller} */
  controller?: PrometheusOptions["controller"];
  useFactory?(
    ...args: unknown[]
  ): Promise<PrometheusOptions> | PrometheusOptions;
}
