import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';

import cookieSession from 'cookie-session';

import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        entities: [User, Report],
      }),
    }),

    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite', // `${process.env.NODE_ENV === 'test' ? 'test' : 'db'}.sqlite`
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['encryption'],
        }),
      )
      .forRoutes('*');
  }
}
