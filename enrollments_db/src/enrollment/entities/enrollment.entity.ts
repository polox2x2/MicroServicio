import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', type: 'int', nullable: false })
  studentId: number;

  @Column({ name: 'course_id', type: 'int', nullable: false })
  courseId: number;

  @CreateDateColumn({
    name: 'enrolled_at',
    type: 'timestamp',
  })
  enrolledAt: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'dropped', 'completed'],
    default: 'active',
  })
  status: 'active' | 'dropped' | 'completed';
}