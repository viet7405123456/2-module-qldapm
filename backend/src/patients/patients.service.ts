import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  // The frontend consumes a flat PatientProfile DTO (dateOfBirth/gender/
  // address/idNumber alongside the user's own fields) rather than Prisma's
  // nested patientProfile relation, so every read path normalizes through this.
  private flatten(user: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: string;
    createdAt: Date;
    passwordHash?: string;
    patientProfile?: {
      dateOfBirth: Date | null;
      gender: string | null;
      address: string | null;
      idNumber: string | null;
    } | null;
    [key: string]: unknown;
  }) {
    const { passwordHash, patientProfile, ...rest } = user;
    return {
      ...rest,
      dateOfBirth: patientProfile?.dateOfBirth ?? null,
      gender: patientProfile?.gender ?? null,
      address: patientProfile?.address ?? null,
      idNumber: patientProfile?.idNumber ?? null,
    };
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });
    if (!user) throw new NotFoundException();
    return this.flatten(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const { fullName, phone, ...profileFields } = dto;
    if (fullName || phone) {
      await this.prisma.user.update({ where: { id: userId }, data: { fullName, phone } });
    }
    await this.prisma.patientProfile.upsert({
      where: { userId },
      update: {
        dateOfBirth: profileFields.dateOfBirth ? new Date(profileFields.dateOfBirth) : undefined,
        gender: profileFields.gender,
        address: profileFields.address,
        idNumber: profileFields.idNumber,
      },
      create: {
        userId,
        dateOfBirth: profileFields.dateOfBirth ? new Date(profileFields.dateOfBirth) : undefined,
        gender: profileFields.gender,
        address: profileFields.address,
        idNumber: profileFields.idNumber,
      },
    });
    return this.findMe(userId);
  }

  async findAll(search?: string, page = 1, pageSize = 200) {
    const where: Record<string, unknown> = { role: 'PATIENT' };
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    const users = await this.prisma.user.findMany({
      where,
      include: { patientProfile: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.flatten(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        patientProfile: true,
        appointments: {
          include: {
            slot: true,
            doctor: { include: { user: { select: { fullName: true } } } },
            department: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user || user.role !== 'PATIENT') throw new NotFoundException('Không tìm thấy bệnh nhân');
    const { appointments, ...rest } = user;
    return {
      ...this.flatten(rest),
      appointments: appointments.map((a) => ({
        id: a.id,
        patientId: a.patientId,
        doctorId: a.doctorId,
        doctorName: a.doctor?.user?.fullName,
        departmentId: a.departmentId,
        departmentName: a.department?.name,
        slotId: a.slotId,
        slotStartTime: a.slot?.startTime,
        slotEndTime: a.slot?.endTime,
        status: a.status,
        reason: a.reason,
        createdAt: a.createdAt,
      })),
    };
  }
}
