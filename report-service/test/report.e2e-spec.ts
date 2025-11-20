import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReportDto } from '../src/report/dto/create-report.dto';
import { CreateMetricDto } from '../src/metric/dto/create-metric.dto';

describe('Report and Metric (e2e)', () => {
  let app: INestApplication;
  let reportId: number;
  let metricId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Report', () => {
    it('should create a report', () => {
      const createReportDto: CreateReportDto = {
        title: 'Test Report',
        type: 'academic',
        date_from: '2025-01-01',
        date_to: '2025-01-31',
      };
      return request(app.getHttpServer())
        .post('/report')
        .send(createReportDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          reportId = res.body.id;
        });
    });

    it('should get all reports', () => {
      return request(app.getHttpServer()).get('/report').expect(200);
    });

    it('should get one report by id', () => {
      return request(app.getHttpServer()).get(`/report/${reportId}`).expect(200);
    });

    it('should update a report', () => {
      const updateReportDto = { title: 'Updated Test Report' };
      return request(app.getHttpServer())
        .patch(`/report/${reportId}`)
        .send(updateReportDto)
        .expect(200)
        .then((res) => {
            expect(res.body.title).toEqual('Updated Test Report');
        });
    });
  });

  describe('Metric', () => {
    it('should create a metric for the report', () => {
      const createMetricDto: CreateMetricDto = {
        name: 'avg_grade',
        value: 15.5,
        report_id: reportId,
      };
      return request(app.getHttpServer())
        .post('/metric')
        .send(createMetricDto)
        .expect(201)
        .then((res) => {
            expect(res.body).toHaveProperty('id');
            metricId = res.body.id;
        });
    });

    it('should get all metrics', () => {
        return request(app.getHttpServer()).get('/metric').expect(200);
    });
    
    it('should delete the metric', () => {
        return request(app.getHttpServer()).delete(`/metric/${metricId}`).expect(204);
    });
  });

  it('should delete the report', () => {
    return request(app.getHttpServer()).delete(`/report/${reportId}`).expect(204);
  });
});
