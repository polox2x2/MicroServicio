import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { TeacherAssignmentService } from '../teacher-assignment/teacher-assignment.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly teacherAssignmentService: TeacherAssignmentService,
  ) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.courseService.remove(id);
  }

  /**
   * Obtiene la asignación de docente para un curso específico.
   * @param courseId ID del curso.
   * @returns Información de la asignación (courseId, teacherId, assignedAt).
   */
  @Get(':id/teacher')
  async getTeacherByCourse(@Param('id') courseId: number) {
    const assignment =
      await this.teacherAssignmentService.findByCourseId(courseId);
    if (!assignment) {
      throw new NotFoundException(
        `No hay docente asignado al curso con ID ${courseId}`,
      );
    }
    return {
      courseId: assignment.courseId,
      teacherId: assignment.teacherId,
      assignedAt: assignment.assignedAt,
    };
  }

  /**
   * Asigna un docente a un curso específico.
   * @param courseId ID del curso.
   * @param teacherId ID del docente a asignar.
   * @returns La nueva asignación creada.
   */
  @Post(':id/assign-teacher')
  async assignTeacherToCourse(
    @Param('id') courseId: number,
    @Body('teacherId') teacherId: number,
  ) {
    const createAssignmentDto = { courseId, teacherId };
    return await this.teacherAssignmentService.create(createAssignmentDto);
  }

  /**
   * Elimina la asignación de docente de un curso específico.
   * @param courseId ID del curso.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id/remove-teacher')
  async removeTeacherFromCourse(@Param('id') courseId: number) {
    const assignment =
      await this.teacherAssignmentService.findByCourseId(courseId);
    if (!assignment) {
      throw new NotFoundException(
        `No hay docente asignado al curso con ID ${courseId}`,
      );
    }
    return await this.teacherAssignmentService.remove(assignment.id);
  }
}
