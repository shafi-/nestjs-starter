import EnvUndefinedException from 'src/config/exceptions/EnvUndefinedException';

export default class ConfigService {
  static getConfig(key: string, required = false) {
    const value = process.env[key];

    if (value === undefined && required) {
      throw new EnvUndefinedException(key);
    }

    return value;
  }

  static setConfig(key: string, value: any) {
    process.env[key] = value;
  }
}
