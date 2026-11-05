import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { SchedulesService } from './schedules.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class SchedulesController {
  constructor(private service: SchedulesService) {}

  @Roles(Role.ADMIN)
  @Post('doctors/:doctorId/shifts')
  createShift(@Param('doctorId') doctorId: string, @Body() dto: CreateShiftDto) {
    return this.service.createShift(doctorId, dto);
  }

  @Roles(Role.ADMIN)
  @Get('doctors/:doctorId/shifts')
  findShifts(
    @Param('doctorId') doctorId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.findShifts(doctorId, from, to);
  }

  @Roles(Role.ADMIN)
  @Delete('shifts/:id')
  deleteShift(@Param('id') id: string) {
    return this.service.deleteShift(id);
  }

  @Public()
  @Get('doctors/:doctorId/slots')
  findSlots(@Param('doctorId') doctorId: string, @Query('date') date: string) {
    return this.service.findAvailableSlots(doctorId, date);
  }
}
