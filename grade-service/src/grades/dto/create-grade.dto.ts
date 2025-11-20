import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateGradeDto {
  @IsNumber()
  @IsNotEmpty()
  evaluation_id: number;

  @IsNumber()
  @IsNotEmpty()
  student_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  score: number; // Assuming score can be 0 or positive, validation for max will depend on evaluation.max_score
}
