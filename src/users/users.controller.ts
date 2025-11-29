import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  Session,
  UseGuards,
  // Res,
  // Response,
  // BadRequestException,
  // UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

import { AuthGuard } from 'src/guards/auth.guard';

// import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

import { CurrentUser } from './decorators/current-user.decorator';

import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';

import { User } from './entities/user.entity';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);

    console.log(user);

    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/whoami')
  // async whoAmI(@Session() session: any, @Res() res: Response) {
  //   const user = await this.usersService.findOne(session.userId);

  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }

  //   return user;
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))

  @Get('/:id')
  findUser(@Param('id') id: string) {
    // console.log('Handler is running');
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
