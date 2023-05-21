import { IUserRepository, IUser, User } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async save(user: User): Promise<User> {
    const userExists = await this.exists(user.email);
    if (!userExists) {
      const createdUser = await this.userModel.create(user.props);
      createdUser.save();
      return user;
    } else {
      throw new Error('User already exists');
    }
  }

  async updateEmail(user: IUser): Promise<string> {
    await this.userModel.updateOne({ email: user.email }, user);
    return 'Email updated';
  }

  async findByEmail(userEmail: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: userEmail });
    return user
      ? new User({
          id: user._id.toHexString(),
          name: user.name,
          email: user.email,
          password: user.password,
          secretToken: user.secretToken,
        })
      : undefined;
  }

  async exists(email: string): Promise<boolean> {
    return await this.userModel.findOne({ email });
  }

  async createSecretToken(user: User): Promise<void> {
    await this.userModel.updateOne({ secretToken: user.secretToken }, user);
  }
}
