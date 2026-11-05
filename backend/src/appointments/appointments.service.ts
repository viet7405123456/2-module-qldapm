import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  // The frontend consumes a flat Appointment DTO (patientName, doctorName,
  // departmentName, slotStartTime/slotEndTime) rather than Prisma's nested
  // patient/doctor/department/slot relations, so every read path normalizes
  // through this.
  private flatten(appt: {
    id: string;
    patientId: string;
    doctorId: string;
    departmentId: string;
    slotId: string;
    status: AppointmentStatus;
    reason: string | null;
    createdAt: Date;
    patient?: { fullName: string; phone: string | null } | null;
    doctor?: { user?: { fullName: string } | null } | null;
    department?: { name: string } | null;
    slot?: { startTime: Date; endTime: Date } | null;
  }) {
    return {
      id: appt.id,
      patientId: appt.patientId,
      patientName: appt.patient?.fullName,
      patientPhone: appt.patient?.phone,
      doctorId: appt.doctorId,
      doctorName: appt.doctor?.user?.fullName,
      departmentId: appt.departmentId,
      departmentName: appt.department?.name,
      slotId: appt.slotId,
      slotStartTime: appt.slot?.startTime,
      slotEndTime: appt.slot?.endTime,
      status: appt.status,
      reason: appt.reason,
      createdAt: appt.createdAt,
    };
  }

  async book(patientId: string, dto: CreateAppointmentDto) {
    const created = await this.prisma.$transaction(async (tx) => {
      const locked: Array<{ id: string; capacity: number; bookedCount: number }> = await tx.$queryRaw`
        SELECT id, capacity, "bookedCount" FROM appointment_slots WHERE id = ${dto.slotId} FOR UPDATE
      `;
      if (locked.length === 0) {
        throw new NotFoundException('Không tìm thấy khung giờ');
      }
      const lockedSlot = locked[0];
      if (lockedSlot.bookedCount >= lockedSlot.capacity) {
        throw new ConflictException('Khung giờ đã đầy, vui lòng chọn khung giờ khác');
      }

      const slotInfo = await tx.appointmentSlot.findUnique({
        where: { id: dto.slotId },
        include: { doctorShift: { include: { doctor: true } } },
      });
      if (!slotInfo) {
        throw new NotFoundException('Không tìm thấy khung giờ');
      }
      if (slotInfo.startTime.getTime() < Date.now()) {
        throw new BadRequestException('Không thể đặt lịch cho khung giờ đã qua');
      }

      await tx.appointmentSlot.update({
        where: { id: dto.slotId },
        data: { bookedCount: { increment: 1 } },
      });

      return tx.appointment.create({
        data: {
          patientId,
          slotId: dto.slotId,
          doctorId: slotInfo.doctorShift.doctorId,
          departmentId: slotInfo.doctorShift.doctor.departmentId,
          reason: dto.reason,
          status: AppointmentStatus.PENDING,
        },
        include: {
          slot: true,
          doctor: { include: { user: { select: { fullName: true } } } },
          department: true,
          patient: { select: { fullName: true, phone: true } },
        },
      });
    });
    return this.flatten(created);
  }

  async findMine(patientId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        slot: true,
        doctor: { include: { user: { select: { fullName: true } } } },
        department: true,
        patient: { select: { fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return appointments.map((a) => this.flatten(a));
  }

  async cancel(id: string, requester: { id: string; role: Role }) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id }, include: { slot: true } });
    if (!appointment) throw new NotFoundException('Không tìm thấy lịch hẹn');

    if (requester.role === Role.PATIENT) {
      if (appointment.patientId !== requester.id) {
        throw new ForbiddenException('Bạn không có quyền hủy lịch hẹn này');
      }
      if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
        throw new BadRequestException('Lịch hẹn này không thể hủy');
      }
      if (appointment.slot.startTime.getTime() < Date.now()) {
        throw new BadRequestException('Không thể hủy lịch hẹn đã qua giờ khám');
      }
    } else if (requester.role !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền hủy lịch hẹn này');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      return appointment;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.appointmentSlot.update({
        where: { id: appointment.slotId },
        data: { bookedCount: { decrement: 1 } },
      });
      return tx.appointment.update({
        where: { id },
        data: { status: AppointmentStatus.CANCELLED },
      });
    });
  }

  async findAll(filters: {
    date?: string;
    doctorId?: string;
    departmentId?: string;
    status?: AppointmentStatus;
    page?: number;
    pageSize?: number;
  }) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 20;

    const where: Record<string, unknown> = {};
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.status) where.status = filters.status;
    if (filters.date) {
      const dayStart = new Date(filters.date);
      const dayEnd = new Date(filters.date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.slot = { startTime: { gte: dayStart, lt: dayEnd } };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        include: {
          slot: true,
          doctor: { include: { user: { select: { fullName: true } } } },
          department: true,
          patient: { select: { id: true, fullName: true, phone: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.appointment.count({ where }),
    ]);
    return { items: data.map((a) => this.flatten(a)), total, page, pageSize };
  }

  async updateStatus(id: string, dto: UpdateStatusDto, requester: { id: string; role: Role }) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Không tìm thấy lịch hẹn');

    if (requester.role === Role.DOCTOR) {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId: requester.id } });
      if (!doctor || appointment.doctorId !== doctor.id) {
        throw new ForbiddenException('Bạn không có quyền cập nhật lịch hẹn này');
      }
      const doctorAllowed: AppointmentStatus[] = [AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW];
      if (!doctorAllowed.includes(dto.status)) {
        throw new ForbiddenException('Bác sĩ chỉ có thể đánh dấu Đã khám hoặc Không đến');
      }
    } else if (requester.role === Role.ADMIN) {
      const allowed: AppointmentStatus[] = [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.COMPLETED,
        AppointmentStatus.NO_SHOW,
      ];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException('Trạng thái không hợp lệ');
      }
    } else {
      throw new ForbiddenException();
    }

    if (dto.status === AppointmentStatus.CANCELLED && appointment.status !== AppointmentStatus.CANCELLED) {
      return this.prisma.$transaction(async (tx) => {
        await tx.appointmentSlot.update({
          where: { id: appointment.slotId },
          data: { bookedCount: { decrement: 1 } },
        });
        return tx.appointment.update({ where: { id }, data: { status: dto.status } });
      });
    }

    return this.prisma.appointment.update({ where: { id }, data: { status: dto.status } });
  }

  async findForDoctorByDate(userId: string, date: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException('Không tìm thấy hồ sơ bác sĩ');
    if (!date) throw new BadRequestException('Thiếu tham số date');

    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        slot: { startTime: { gte: dayStart, lt: dayEnd } },
      },
      include: {
        slot: true,
        patient: { select: { fullName: true, phone: true, email: true } },
      },
      orderBy: { slot: { startTime: 'asc' } },
    });
    return appointments.map((a) => this.flatten(a));
  }
}
