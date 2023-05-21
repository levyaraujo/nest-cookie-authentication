import { IUserRepository } from '@app/core/domain';
import { User } from '@app/core/domain';

export class UserInMemoryRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    const userExists = await this.findByEmail(user.email);
    if (!userExists) {
      this.users.push(user);
      return user;
    } else {
      throw new Error('User already exists');
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return user ? user : undefined;
  }

  async updateEmail(user: User): Promise<string> {
    user.updateEmail(user.email);
    return 'Email updated';
  }

  async exists(email: string): Promise<boolean> {
    return !!this.findByEmail(email);
  }

  createSecretToken(user: User): void {
    user.createSecretToken(user.secretToken);
  }
}
