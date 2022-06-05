import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false, unique: true, index: true })
  email: string;

  @Prop({ length: 15, required: true, unique: true, index: true })
  phone: string;

  @Prop({ length: 256, required: false })
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (doc, ret, opt = {}) => {
    ret.id = ret._id;

    delete ret.password;
    delete ret.__v;

    return ret;
  },
});
