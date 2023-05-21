import { User, IUser } from '../user.entity';
import { ObjectId } from 'mongodb';

const userData: IUser = {
  id: new ObjectId().toHexString(),
  email: 'johndoe@email.com',
  name: 'John Doe',
  password: '123456',
};

const user = new User(userData);

describe('User', () => {
  test('should create a user', () => {
    expect(user.props).toStrictEqual({ ...userData, secretToken: '' });
  });
});
