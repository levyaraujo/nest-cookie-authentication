import { User } from './user.entity';

export interface IUserRepository {
  save(user: User): Promise<User>;
  updateEmail(user: User): Promise<string>;
  findByEmail(email: string): Promise<User | undefined>;
  exists(email: string): Promise<boolean>;
  createSecretToken(user: User): void;
  // Add more methods as needed, such as delete, findAll, etc.
}
