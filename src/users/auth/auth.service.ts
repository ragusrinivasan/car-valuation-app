import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scryptSync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    //Hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = scryptSync(password, salt, 32).toString('hex');

    //Join the hashed result and the salt together
    const result = `${salt}.${hash}`;

    //Create a new user and save it
    const user = await this.usersService.create(email, result);

    //return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = scryptSync(password, salt, 32).toString('hex');

    if (storedHash !== hash) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
