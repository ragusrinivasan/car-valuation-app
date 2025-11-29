import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from '../users.service';

import { User } from '../entities/user.entity';

// it('can create an instance of auth service', async () => {
//   //Create a fake copy of the users service
//   const fakeUsersService: Partial<UsersService> = {
//     find: () => Promise.resolve([]),
//     create: (email: string, password: string) =>
//       Promise.resolve({ id: 1, email, password } as User),
//   };

//   const module = await Test.createTestingModule({
//     providers: [
//       AuthService,
//       { provide: UsersService, useValue: fakeUsersService },
//     ],
//   }).compile();

//   const service = module.get(AuthService);

//   expect(service).toBeDefined();
// });

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the users service
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('sdfh@sdf,com', 'sdf');

    expect(user.password).not.toEqual('sdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error when user signs up with an email already in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '123' } as User]);

    await service.signup('asdf@asdf.com', 'mypassword');

    await expect(service.signup('asdf@asdf.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('sdfdf@sdfd.com', 'sdfdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '123' } as User]);
    await service.signup('asdf@asdf.com', 'password');

    await expect(service.signin('asdf@asdf.com', 'sdfdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'asdf@asdf.com',
    //       password:
    //         '6d4a904c9819c6a0.925baefef4be00be12581ef36c891e4071001f5704391c99fbad602d31879a31',
    //     } as User,
    //   ]);
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
