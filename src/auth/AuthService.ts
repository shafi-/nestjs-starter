import AuthConfig from 'src/auth/AuthConfig';
import AuthUser from 'src/auth/AuthUser';

export default class AuthService {
  constructor(private authConfig: AuthConfig) {}

  async login(): Promise<AuthUser> {
    return {} as AuthUser;
  }

  async register(): Promise<AuthUser> {
    return {} as AuthUser;
  }
}
