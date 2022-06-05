import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import { User, UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(query: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(query);
  }

  async findByEmailOrPhone(username: string): Promise<UserDocument> {
    return this.userModel.findOne({
      $or: [{ email: username }, { phone: username }],
    });
  }

  register(userInfo: UserRegistrationDto): Promise<UserDocument> {
    return this.userModel.create(userInfo);
  }

  async resetPassword(user: UserDocument, newPass: string) {
    return this.userModel
      .updateOne(
        { _id: user.id },
        {
          password: newPass,
        },
      )
      .exec();
  }
}
