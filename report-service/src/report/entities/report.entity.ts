import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Metric } from '../../metric/entities/metric.entity';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // 'academic', 'attendance', 'support'

  @Column({ type: 'date' })
  date_from: Date;

  @Column({ type: 'date' })
  date_to: Date;

  @CreateDateColumn({ name: 'generated_at', type: 'timestamp' })
  generated_at: Date;

  @OneToMany(() => Metric, (metric) => metric.report)
  metrics: Metric[];
}
