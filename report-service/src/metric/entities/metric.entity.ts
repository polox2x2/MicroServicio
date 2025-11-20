import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Report } from '../../report/entities/report.entity';

@Entity('metric')
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => Report, (report) => report.metrics)
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
