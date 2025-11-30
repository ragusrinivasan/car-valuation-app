import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users/users.service';

import { User } from '../users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User | null;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}
