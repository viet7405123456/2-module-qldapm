import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentStatus, Role } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Roles(Role.PATIENT)
  @Post()
  book(@CurrentUser() user: { id: string }, @Body() dto: CreateAppointmentDto) {
    return this.service.book(user.id, dto);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  findMine(@CurrentUser() user: { id: string }) {
    return this.service.findMine(user.id);
  }

  @Roles(Role.DOCTOR)
  @Get('doctor/me')
  findForDoctor(@CurrentUser() user: { id: string }, @Query('date') date: string) {
    return this.service.findForDoctorByDate(user.id, date);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('doctorId') doctorId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.service.findAll({
      date,
      doctorId,
      departmentId,
      status,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Roles(Role.PATIENT, Role.ADMIN)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: { id: string; role: Role }) {
    return this.service.cancel(id, user);
  }

  @Roles(Role.DOCTOR, Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.service.updateStatus(id, dto, user);
  }
}
