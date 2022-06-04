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

  register(userInfo: UserRegistrationDto): Promise<UserDocument> {
    return this.userModel.create(userInfo);
  }
}
