import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
@Entity('teacher_assignment')
export class TeacherAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id', type: 'int', nullable: false })
  courseId: number; // FK lógica a course.id en courses_db

  @Column({ name: 'teacher_id', type: 'int', nullable: false })
  teacherId: number; // FK lógica a user.id en users_db

  @Column({
    name: 'assigned_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt: Date;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Esto no funcionaría directamente
  // @JoinColumn({ name: 'teacher_id' })
  // teacher: User;
}
