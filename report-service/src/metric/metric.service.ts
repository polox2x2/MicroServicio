import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric } from './entities/metric.entity';
import { Report } from '../report/entities/report.entity';

@Injectable()
export class MetricService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create_Metric(createMetricDto: CreateMetricDto): Promise<Metric> {
    const report = await this.reportRepository.findOneBy({
      id: createMetricDto.report_id,
    });
    if (!report) {
      throw new NotFoundException(
        `Report with ID ${createMetricDto.report_id} not found`,
      );
    }

    const metric = this.metricRepository.create({
      name: createMetricDto.name,
      value: createMetricDto.value,
      report: report,
    });

    return this.metricRepository.save(metric);
  }

  find_All_Metrics(): Promise<Metric[]> {
    return this.metricRepository.find({ relations: ['report'] });
  }

  async find_One_Metric(id: number): Promise<Metric> {
    const metric = await this.metricRepository.findOne({
      where: { id },
      relations: ['report'],
    });
    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }
    return metric;
  }

  async update_Metric(
    id: number,
    updateMetricDto: UpdateMetricDto,
  ): Promise<Metric> {
    // First, find the existing metric
    const metric = await this.find_One_Metric(id);

    // If a new report_id is provided, find the new report and update the relation
    if (updateMetricDto.report_id) {
      const report = await this.reportRepository.findOneBy({
        id: updateMetricDto.report_id,
      });
      if (!report) {
        throw new NotFoundException(
          `Report with ID ${updateMetricDto.report_id} not found`,
        );
      }
      metric.report = report;
    }

    // Update metric properties if they are provided in the DTO
    if (updateMetricDto.name) {
      metric.name = updateMetricDto.name;
    }
    if (updateMetricDto.value !== undefined) {
      metric.value = updateMetricDto.value;
    }

    // Save the updated metric
    return this.metricRepository.save(metric);
  }

  async remove_Metric(id: number): Promise<void> {
    const result = await this.metricRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }
  }
}
