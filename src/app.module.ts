import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, ReportsModule],
})
export class AppModule {}
