// src/evaluation/entities/evaluation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Grade } from '../../grades/entities/grade.entity'; // Importamos la entidad Grade

@Entity('evaluation') // Mapea esta entidad a la tabla 'evaluation'
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  course_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20.0 })
  max_score: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  weight: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  // Relación OneToMany con Grade
  @OneToMany(() => Grade, (grade) => grade.evaluation)
  grades: Grade[];
}
