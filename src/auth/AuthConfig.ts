import { GetConfig } from 'src/config/get-config.decorator';

export default class AuthConfig {
  @GetConfig({ name: 'username', defaultValue: 'email', required: false })
  username: string;

  @GetConfig({ name: 'provider', defaultValue: 'UserService' })
  userProvider: string;
}
