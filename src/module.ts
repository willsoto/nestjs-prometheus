import {
  DynamicModule,
  FactoryProvider,
  Module,
  Provider,
} from "@nestjs/common";
import * as promClient from "prom-client";
import { RegistryContentType } from "prom-client";
import { PROMETHEUS_OPTIONS, PROM_CLIENT } from "./constants";
import { PrometheusController } from "./controller";
import {
  PrometheusAsyncOptions,
  PrometheusOptions,
  PrometheusOptionsFactory,
  PrometheusOptionsWithDefaults,
} from "./interfaces";

/**
 * The primary entrypoint. This should be registered once in the root application module.
 *
 * @public
 */
@Module({})
export class PrometheusModule {
  public static register<T extends RegistryContentType>(
    options?: PrometheusOptions<T>,
  ): DynamicModule {
    const opts = PrometheusModule.makeDefaultOptions(options);

    PrometheusModule.configureServer(opts);

    const providers: Provider[] = [
      {
        provide: PROMETHEUS_OPTIONS,
        useValue: options,
      },
    ];
    if (options?.pushgateway !== undefined) {
      const { url, options: gatewayOptions, registry } = options.pushgateway;
      providers.push({
        provide: promClient.Pushgateway,
        useValue: PrometheusModule.configurePushgateway(
          url,
          gatewayOptions,
          registry,
        ),
      });
    }

    return {
      module: PrometheusModule,
      global: opts.global,
      providers,
      controllers: [opts.controller],
      exports: providers,
    };
  }

  public static registerAsync<T extends RegistryContentType>(
    options: PrometheusAsyncOptions<T>,
  ): DynamicModule {
    const providers = this.createAsyncProviders(options);
    const controller = options.controller ?? PrometheusController;

    return {
      module: PrometheusModule,
      global: options.global,
      controllers: [controller],
      imports: options.imports,
      providers: [
        ...providers,
        {
          provide: PROM_CLIENT,
          inject: [PROMETHEUS_OPTIONS],
          useFactory<T extends RegistryContentType>(
            userOptions: PrometheusOptions<T>,
          ) {
            const opts = PrometheusModule.makeDefaultOptions(userOptions);

            PrometheusModule.configureServer(opts);

            return promClient;
          },
        },
      ],
      exports: [...providers],
    };
  }

  public static createAsyncProviders<T extends RegistryContentType>(
    options: PrometheusAsyncOptions<T>,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncOptionsProvider(options),
        PrometheusModule.createPushgatewayProvider(),
      ];
    } else if (!options.useClass) {
      throw new Error(
        "Invalid configuration. Must provide useClass or useExisting",
      );
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      PrometheusModule.createPushgatewayProvider(),
    ];
  }

  public static createAsyncOptionsProvider<T extends RegistryContentType>(
    options: PrometheusAsyncOptions<T>,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROMETHEUS_OPTIONS,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        "Invalid configuration. Must provide useClass or useExisting",
      );
    }

    return {
      provide: PROMETHEUS_OPTIONS,
      async useFactory<T extends RegistryContentType>(
        optionsFactory: PrometheusOptionsFactory<T>,
      ): Promise<PrometheusOptions<T>> {
        return optionsFactory.createPrometheusOptions();
      },
      inject: [inject],
    };
  }

  private static configureServer<T extends RegistryContentType>(
    options: PrometheusOptionsWithDefaults<T>,
  ): void {
    if (options.defaultMetrics.enabled) {
      promClient.collectDefaultMetrics(options.defaultMetrics.config);
    }

    if (Object.keys(options.defaultLabels).length > 0) {
      promClient.register.setDefaultLabels(options.defaultLabels);
    }

    Reflect.defineMetadata("path", options.path, options.controller);
  }

  private static configurePushgateway<T extends RegistryContentType>(
    url: string,
    options?: unknown,
    registry?: promClient.Registry,
  ): promClient.Pushgateway<T> {
    return new promClient.Pushgateway(url, options, registry);
  }

  private static createPushgatewayProvider(): FactoryProvider {
    return {
      provide: promClient.Pushgateway,
      inject: [PROMETHEUS_OPTIONS],
      useFactory<T extends RegistryContentType>(options: PrometheusOptions<T>) {
        if (options?.pushgateway !== undefined) {
          const {
            url,
            options: gatewayOptions,
            registry,
          } = options.pushgateway;

          return PrometheusModule.configurePushgateway(
            url,
            gatewayOptions,
            registry,
          );
        }

        return null;
      },
    };
  }

  private static makeDefaultOptions<T extends RegistryContentType>(
    options?: PrometheusOptions<T>,
  ): PrometheusOptionsWithDefaults<T> {
    return {
      global: false,
      path: "/metrics",
      defaultMetrics: {
        enabled: true,
        config: {},
      },
      controller: PrometheusController,
      defaultLabels: {},
      ...options,
    };
  }
}
