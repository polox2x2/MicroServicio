import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TicketClient } from './ticket.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, TicketClient],
})
export class ReportModule { }
