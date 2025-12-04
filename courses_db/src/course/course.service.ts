import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  private generateCourseCode(name: string): string {
    const prefix = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${random}`;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const courseCode = this.generateCourseCode(createCourseDto.name);

    const course = this.courseRepository.create({
      ...createCourseDto,
      credits: createCourseDto.credits ?? 3,
      code: courseCode,
    });

    return await this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async findOne(id: number): Promise<Course | null> {
    return await this.courseRepository.findOneBy({ id: Number(id) });
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course | null> {
    await this.courseRepository.update(id, updateCourseDto);
    return await this.courseRepository.findOneBy({ id: Number(id) });
  }

  async remove(id: number): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
