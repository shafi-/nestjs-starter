import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(query: Partial<User>): Promise<User> {
    return this.userModel.findOne(query);
  }
}
