import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ expires: 'expiresAt' })
export class PassResetRequest {
  @Prop({ index: true })
  userId: string;

  @Prop()
  token: string;

  @Prop()
  createdAt: Date;

  @Prop()
  expiresAt: Date;
}

export type PassResetRequestDocument = PassResetRequest & Document;
export const PassResetRequestSchema =
  SchemaFactory.createForClass(PassResetRequest);
