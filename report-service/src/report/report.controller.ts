import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express';

@Controller('api/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('tickets/summary')
  async getSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // Default to last 30 days if not provided
    const end = endDate || new Date().toISOString();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.reportService.getTicketSummary(start, end);
  }

  @Get('advisors/performance')
  async getAdvisorPerformance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const end = endDate || new Date().toISOString();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.reportService.getAdvisorPerformance(start, end);
  }

  @Get('export')
  async exportReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const end = endDate || new Date().toISOString();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const csv = await this.reportService.exportReport(start, end);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=report.csv');
    res.send(csv);
  }
}
