import { Type } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import client from "prom-client";

/**
 * Options for the Prometheus Module
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
   *   index(@Res() response: Response) {
   *     super(response);
   *   }
   * }
   * ```
   */
  controller?: Type<unknown>;
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

  controller?: PrometheusOptions["controller"];
  /**
   * Not currently supported since there doesn't seem to be a way to get
   * the result of the function during configuration.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // useFactory?(...args: any[]): Promise<PrometheusOptions> | PrometheusOptions;
}
