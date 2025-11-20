import { Module } from '@nestjs/common';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importamos TypeOrmModule
import { Evaluation } from './entities/evaluation.entity'; // Importamos la entidad Evaluation

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation]), // Registramos la entidad Evaluation con TypeORM
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
