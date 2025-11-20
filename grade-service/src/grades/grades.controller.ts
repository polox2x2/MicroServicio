import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto'; // Importamos el DTO

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  /**
   * @method Create_Grade
   * @description Maneja las peticiones POST para crear una nueva nota.
   * Valida el cuerpo de la petición usando CreateGradeDto.
   * @param createGradeDto Los datos para crear la nota.
   * @returns El resultado de la operación de creación de la nota.
   */
  @Post()
  @UsePipes(new ValidationPipe()) // Aplica la validación del DTO
  Create_Grade(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.Create_Grade(createGradeDto);
  }
}
