import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';

import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asds@asd.com',
          password: 'wfsdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 5,
            email,
            password: 'wfsdf',
          } as User,
        ]);
      },
      // remove: (id: number) => {},
      // update: (id, attrs) => {},
    };
    fakeAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      // signup: (email: string, password: string) => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asds@asd.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asds@asd.com');
  });

  it('findUser returns a singlr user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'sdff@sdd.com',
        password: 'dfdf',
      } as User,
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
