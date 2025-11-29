import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';

import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

import { ReportsService } from './reports.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }
}
