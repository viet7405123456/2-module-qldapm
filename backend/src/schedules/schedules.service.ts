import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async createShift(doctorId: string, dto: CreateShiftDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Không tìm thấy bác sĩ');

    const workDate = new Date(dto.workDate);
    const existing = await this.prisma.doctorShift.findUnique({
      where: { doctorId_workDate_shift: { doctorId, workDate, shift: dto.shift } },
    });
    if (existing) throw new ConflictException('Ca làm việc này đã tồn tại cho bác sĩ vào ngày đã chọn');

    const slots = this.buildSlots(dto, workDate);
    if (slots.length === 0) {
      throw new BadRequestException('Khoảng thời gian không hợp lệ để tạo khung giờ');
    }

    return this.prisma.$transaction(async (tx) => {
      const shift = await tx.doctorShift.create({
        data: {
          doctorId,
          workDate,
          shift: dto.shift,
          startTime: dto.startTime,
          endTime: dto.endTime,
          slotDurationMinutes: dto.slotDurationMinutes,
          capacityPerSlot: dto.capacityPerSlot,
        },
      });
      await tx.appointmentSlot.createMany({
        data: slots.map((s) => ({
          doctorShiftId: shift.id,
          startTime: s.start,
          endTime: s.end,
          capacity: dto.capacityPerSlot,
          bookedCount: 0,
        })),
      });
      return tx.doctorShift.findUnique({ where: { id: shift.id }, include: { slots: true } });
    });
  }

  private buildSlots(dto: CreateShiftDto, workDate: Date) {
    const [startH, startM] = dto.startTime.split(':').map(Number);
    const [endH, endM] = dto.endTime.split(':').map(Number);
    const base = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    const slots: { start: Date; end: Date }[] = [];
    for (let m = startTotal; m + dto.slotDurationMinutes <= endTotal; m += dto.slotDurationMinutes) {
      const start = new Date(base);
      start.setMinutes(m);
      const end = new Date(base);
      end.setMinutes(m + dto.slotDurationMinutes);
      slots.push({ start, end });
    }
    return slots;
  }

  findShifts(doctorId: string, from?: string, to?: string) {
    return this.prisma.doctorShift.findMany({
      where: {
        doctorId,
        workDate: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      include: { slots: true },
      orderBy: { workDate: 'asc' },
    });
  }

  async deleteShift(id: string) {
    const shift = await this.prisma.doctorShift.findUnique({ where: { id }, include: { slots: true } });
    if (!shift) throw new NotFoundException('Không tìm thấy ca làm việc');
    const slotIds = shift.slots.map((s) => s.id);
    const bookedCount = await this.prisma.appointment.count({
      where: { slotId: { in: slotIds }, status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] } },
    });
    if (bookedCount > 0) {
      throw new ConflictException('Không thể xóa ca làm việc đã có bệnh nhân đăng ký');
    }
    await this.prisma.appointmentSlot.deleteMany({ where: { doctorShiftId: id } });
    await this.prisma.doctorShift.delete({ where: { id } });
    return { success: true };
  }

  async findAvailableSlots(doctorId: string, date: string) {
    if (!date) throw new BadRequestException('Thiếu tham số date');
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const now = new Date();
    const lowerBound = dayStart < now ? now : dayStart;

    const slots = await this.prisma.appointmentSlot.findMany({
      where: {
        doctorShift: { doctorId },
        startTime: { gte: lowerBound, lt: dayEnd },
      },
      orderBy: { startTime: 'asc' },
    });

    return slots.map((s) => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      capacity: s.capacity,
      bookedCount: s.bookedCount,
      remaining: s.capacity - s.bookedCount,
      full: s.bookedCount >= s.capacity,
    }));
  }
}
