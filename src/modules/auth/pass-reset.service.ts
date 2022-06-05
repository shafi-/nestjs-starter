import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { PassResetRequest } from 'src/modules/auth/schema/pass-reset.schema';
import { UserDocument } from 'src/modules/user/user.schema';

const TokenValidityInMinute = 30;

@Injectable()
export default class PassResetRequestService {
  constructor(
    @InjectModel(PassResetRequest.name)
    private prModel: Model<PassResetRequest>,
  ) {}

  async findLatestByUser(id: any): Promise<PassResetRequest> {
    return this.prModel
      .findOne({
        userId: id,
        expiresAt: {
          $gt: dayjs(),
        },
      })
      .sort({ expiredAt: 'desc' })
      .exec();
  }

  async save(userId: string, token: string): Promise<boolean> {
    await this.prModel.create({
      userId: userId,
      token,
      createdAt: dayjs(),
      expiresAt: dayjs().add(TokenValidityInMinute, 'minutes'),
    });

    return true;
  }

  async sendToken(user: UserDocument, token: string) {
    console.log({ user, token });
  }
}
