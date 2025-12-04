import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';

@Injectable()
export class TeacherAssignmentService {
  constructor(
    @InjectRepository(TeacherAssignment)
    private readonly teacherAssignmentRepository: Repository<TeacherAssignment>,
  ) {}

  async create(
    createTeacherAssignmentDto: CreateTeacherAssignmentDto,
  ): Promise<TeacherAssignment> {
    const assignment = this.teacherAssignmentRepository.create(
      createTeacherAssignmentDto,
    );
    return await this.teacherAssignmentRepository.save(assignment);
  }

  async findAll(): Promise<TeacherAssignment[]> {
    return await this.teacherAssignmentRepository.find({
      select: {
        id: true,
        courseId: true,
        teacherId: true,
        assignedAt: true,
      },
      relations: ['course'],
    });
  }

  async findOne(id: number): Promise<TeacherAssignment> {
    const assignment = await this.teacherAssignmentRepository.findOne({
      where: { id },
      select: {
        id: true,
        courseId: true,
        teacherId: true,
        assignedAt: true,
      },
      relations: ['course'],
    });

    if (!assignment) {
      throw new NotFoundException('TeacherAssignment no encontrado');
    }

    return assignment;
  }

  async update(
    id: number,
    updateTeacherAssignmentDto: UpdateTeacherAssignmentDto,
  ): Promise<TeacherAssignment> {
    const assignment = await this.teacherAssignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('TeacherAssignment no encontrado');
    }

    await this.teacherAssignmentRepository.update(
      id,
      updateTeacherAssignmentDto,
    );

    const updatedAssignment = await this.teacherAssignmentRepository.findOne({
      where: { id },
      select: {
        id: true,
        courseId: true,
        teacherId: true,
        assignedAt: true,
      },
      relations: ['course'],
    });

    if (!updatedAssignment) {
      throw new NotFoundException('TeacherAssignment no encontrado');
    }

    return updatedAssignment;
  }

  async remove(id: number): Promise<{ message: string }> {
    const assignment = await this.teacherAssignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('TeacherAssignment no encontrado');
    }

    await this.teacherAssignmentRepository.delete(id);

    return { message: 'TeacherAssignment eliminado correctamente' };
  }

  // Método para encontrar la asignación por courseId
  async findByCourseId(courseId: number): Promise<TeacherAssignment | null> {
    // Puedes buscar la última asignación activa si manejas historial
    // o simplemente la primera si solo hay una asignación activa por curso
    return await this.teacherAssignmentRepository.findOne({
      where: { courseId },
      // order: { assignedAt: 'DESC' }, // Si quieres la más reciente
      select: {
        id: true,
        courseId: true,
        teacherId: true,
        assignedAt: true,
      },
      relations: ['course'], // Incluye datos del curso si es necesario
    });
  }
}
