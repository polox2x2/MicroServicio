import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  date_from: string;

  @IsDateString()
  @IsNotEmpty()
  date_to: string;
}
