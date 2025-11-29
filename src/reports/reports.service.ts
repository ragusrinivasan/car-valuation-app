import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import { User } from 'src/users/entities/user.entity';

import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
