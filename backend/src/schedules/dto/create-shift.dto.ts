import { IsDateString, IsEnum, IsInt, Matches, Min } from 'class-validator';
import { ShiftType } from '@prisma/client';

export class CreateShiftDto {
  @IsDateString()
  workDate: string;

  @IsEnum(ShiftType)
  shift: ShiftType;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime phải có dạng HH:mm' })
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime phải có dạng HH:mm' })
  endTime: string;

  @IsInt()
  @Min(5)
  slotDurationMinutes: number;

  @IsInt()
  @Min(1)
  capacityPerSlot: number;
}
