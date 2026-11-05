import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  // The frontend consumes a flat Doctor DTO (fullName/email/phone/departmentName
  // alongside the doctor's own fields) rather than Prisma's nested
  // department/user relations, so every read path normalizes through this.
  private flatten(doctor: {
    id: string;
    userId: string;
    departmentId: string;
    title: string | null;
    bio: string | null;
    department?: { name: string } | null;
    user?: { fullName: string; email: string; phone: string | null } | null;
  }) {
    return {
      id: doctor.id,
      userId: doctor.userId,
      departmentId: doctor.departmentId,
      title: doctor.title,
      bio: doctor.bio,
      fullName: doctor.user?.fullName,
      email: doctor.user?.email,
      phone: doctor.user?.phone,
      departmentName: doctor.department?.name,
    };
  }

  async findAll(departmentId?: string) {
    const doctors = await this.prisma.doctor.findMany({
      where: departmentId ? { departmentId } : undefined,
      include: {
        department: true,
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
      orderBy: { id: 'asc' },
    });
    return doctors.map((d) => this.flatten(d));
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        department: true,
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });
    if (!doctor) throw new NotFoundException('Không tìm thấy bác sĩ');
    return this.flatten(doctor);
  }

  async create(dto: CreateDoctorDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email đã được sử dụng');
    const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Không tìm thấy khoa');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        role: Role.DOCTOR,
        doctor: {
          create: {
            departmentId: dto.departmentId,
            title: dto.title,
            bio: dto.bio,
          },
        },
      },
      include: { doctor: { include: { department: true } } },
    });
    return this.flatten({ ...user.doctor!, user: { fullName: user.fullName, email: user.email, phone: user.phone } });
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const doctor = await this.findOne(id);
    if (dto.departmentId) {
      const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
      if (!department) throw new NotFoundException('Không tìm thấy khoa');
    }
    if (dto.fullName || dto.phone) {
      await this.prisma.user.update({
        where: { id: doctor.userId },
        data: { fullName: dto.fullName, phone: dto.phone },
      });
    }
    const updated = await this.prisma.doctor.update({
      where: { id },
      data: {
        departmentId: dto.departmentId,
        title: dto.title,
        bio: dto.bio,
      },
      include: { department: true, user: { select: { id: true, fullName: true, email: true, phone: true } } },
    });
    return this.flatten(updated);
  }

  async remove(id: string) {
    const doctor = await this.findOne(id);
    const futureAppointments = await this.prisma.appointment.count({
      where: {
        doctorId: id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        slot: { startTime: { gte: new Date() } },
      },
    });
    if (futureAppointments > 0) {
      throw new ConflictException('Không thể xóa bác sĩ còn lịch hẹn sắp tới');
    }
    await this.prisma.doctor.delete({ where: { id } });
    await this.prisma.user.delete({ where: { id: doctor.userId } });
    return { success: true };
  }
}
