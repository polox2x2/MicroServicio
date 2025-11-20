import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  value: number;

  @IsInt()
  report_id: number;
}
