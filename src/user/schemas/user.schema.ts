import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@app/core';

@Schema()
export class User implements IUser {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  secretToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
