import { IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  slotId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
