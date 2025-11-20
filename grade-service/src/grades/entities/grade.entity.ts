// src/grades/entities/grade.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
// import { Evaluation } from '../../evaluation/entities/evaluation.entity'; // Asumiendo que la entidad Evaluation se creará más tarde

@Entity('grade') // Mapea esta entidad a la tabla 'grade'
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ name: 'evaluation_id' })
  evaluation_id: number;

  @Column({ name: 'student_id' })
  student_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'recorded_at',
  })
  recorded_at: Date;

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.grades)
  @JoinColumn({ name: 'evaluation_id' }) // Define la columna de unión                                                                                                                                                              │
  evaluation: Evaluation;
}
