import GetConfigOption from 'src/config/domain/GetConfigOption.type';
import EnvUndefinedException from 'src/config/exceptions/EnvUndefinedException';

export default class ConfigService {
  static getConfig(name: string, options?: GetConfigOption) {
    if (!options) {
      options = { name };
    }

    const value = process.env[options.name];

    if (value === undefined && options.required) {
      throw new EnvUndefinedException(options.name);
    }

    return value || options.defaultValue;
  }

  static setConfig(key: string, value: any) {
    process.env[key] = value;
  }
}
