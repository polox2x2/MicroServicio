// src/evaluation/dto/create-evaluation.dto.ts
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvaluationDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  max_score?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  weight?: number;
}
