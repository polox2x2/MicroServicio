import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 20, nullable: false })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  semester: string; // Ej: "2025-I"

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp', // clave
  })
  createdAt: Date;
}
