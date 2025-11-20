import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importamos TypeOrmModule
import { Grade } from './entities/grade.entity'; // Importamos la entidad Grade

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade]), // Registramos la entidad Grade con TypeORM
  ],
  controllers: [GradesController],
  providers: [GradesService]
})
export class GradesModule {}
