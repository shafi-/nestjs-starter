import RegistrationRequest from 'src/auth/domain/RegistrationRequest';

export default abstract class AuthUserProvider<TUser> {
  abstract register(registrationRequest: RegistrationRequest): Promise<TUser>;

  abstract getUser(userName: string): TUser;
}
