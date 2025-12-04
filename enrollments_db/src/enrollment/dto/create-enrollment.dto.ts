export class CreateEnrollmentDto {
  studentId: number;
  courseId: number;
  status?: 'active' | 'dropped' | 'completed';
}
