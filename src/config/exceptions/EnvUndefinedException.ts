export default class EnvUndefinedException {
  constructor(private key: string) {}

  toString() {
    return `${this.key} is not defined in the current environment`;
  }
}
