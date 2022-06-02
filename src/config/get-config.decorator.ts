import { LiteralObject } from '@nestjs/common';
import ConfigService from 'src/config/config.service';
import GetConfigOption from 'src/config/domain/GetConfigOption.type';
import ConfigException from 'src/config/exceptions/ConfigException';

export const getClassName = (type: LiteralObject): string =>
  type?.constructor?.name || 'unknown';

export function GetConfig(
  target: LiteralObject,
  property: string,
  options?: GetConfigOption,
): PropertyDecorator {
  if (options && options.defaultValue) {
    throw new ConfigException(
      'Define default configuration as part of your ".env" file.',
    );
  }

  return (target: LiteralObject, propertyKey: string): void => {
    const typeName = getClassName(target);
    const getter = (): unknown => {
      return ConfigService.getConfig(
        propertyKey,
        options,
        // `${typeName}.${propertyKey}`,
      );
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: () => {
        throw new ConfigException(
          `${typeName}.${propertyKey}: You cannot change a @Config value.`,
        );
      },
    });
  };
}
