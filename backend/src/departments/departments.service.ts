import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.department.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const dept = await this.prisma.department.findUnique({ where: { id } });
    if (!dept) throw new NotFoundException('Không tìm thấy khoa');
    return dept;
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Tên khoa đã tồn tại');
    return this.prisma.department.create({ data: dto });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    await this.findOne(id);
    return this.prisma.department.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    const doctorCount = await this.prisma.doctor.count({ where: { departmentId: id } });
    if (doctorCount > 0) {
      throw new ConflictException('Không thể xóa khoa còn bác sĩ đang công tác');
    }
    await this.prisma.department.delete({ where: { id } });
    return { success: true };
  }
}
