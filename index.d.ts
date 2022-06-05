import { UserDocument } from 'src/modules/user/user.schema';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserDocument {}
  }
}
