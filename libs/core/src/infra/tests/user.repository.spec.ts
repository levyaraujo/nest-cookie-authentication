import { UserInMemoryRepository } from '../database/in-memory/user.in-memory.repository';
import { User } from '@app/core';
import { ObjectId } from 'mongodb';

const user = new User({
  id: new ObjectId().toHexString(),
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
});

describe('UserInMemoryRepository', () => {
  test('should save a user', async () => {
    const userRepo = new UserInMemoryRepository();
    const savedUser = await userRepo.save(user);
    expect(savedUser).toEqual(user);
  });

  test('should find a user by email', async () => {
    const userRepo = new UserInMemoryRepository();
    await userRepo.save(user);
    const foundUser = await userRepo.findByEmail(user.email);
    expect(foundUser).toEqual(user);
  });
});
