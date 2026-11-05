import { PrismaClient, Role, ShiftType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertUserWithRole(
  email: string,
  password: string,
  fullName: string,
  role: Role,
  phone?: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, fullName, role, phone },
  });
}

async function ensureShiftsForDoctor(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const shiftDefs: Array<[ShiftType, string, string]> = [
    [ShiftType.MORNING, '07:30', '11:30'],
    [ShiftType.AFTERNOON, '13:30', '17:00'],
  ];
  const slotDurationMinutes = 30;
  const capacityPerSlot = 1;

  for (let i = 0; i < 7; i++) {
    const workDate = new Date(today);
    workDate.setDate(workDate.getDate() + i);

    for (const [shift, startTime, endTime] of shiftDefs) {
      const existing = await prisma.doctorShift.findUnique({
        where: { doctorId_workDate_shift: { doctorId, workDate, shift } },
      });
      if (existing) continue;

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      const shiftRecord = await prisma.doctorShift.create({
        data: {
          doctorId,
          workDate,
          shift,
          startTime,
          endTime,
          slotDurationMinutes,
          capacityPerSlot,
        },
      });

      const slotsData = [];
      for (let m = startTotal; m + slotDurationMinutes <= endTotal; m += slotDurationMinutes) {
        const start = new Date(workDate);
        start.setMinutes(m);
        const end = new Date(workDate);
        end.setMinutes(m + slotDurationMinutes);
        slotsData.push({
          doctorShiftId: shiftRecord.id,
          startTime: start,
          endTime: end,
          capacity: capacityPerSlot,
          bookedCount: 0,
        });
      }
      if (slotsData.length > 0) {
        await prisma.appointmentSlot.createMany({ data: slotsData });
      }
    }
  }
}

async function main() {
  await upsertUserWithRole('admin@clinic.local', 'Admin@123', 'Quản trị viên', Role.ADMIN);

  const departmentsData = [
    { name: 'Nội tổng quát', description: 'Khám và điều trị các bệnh lý nội khoa tổng quát' },
    { name: 'Nhi khoa', description: 'Khám và điều trị cho trẻ em' },
    { name: 'Tai Mũi Họng', description: 'Khám và điều trị các bệnh lý Tai - Mũi - Họng' },
  ];
  const departments = [];
  for (const d of departmentsData) {
    departments.push(
      await prisma.department.upsert({ where: { name: d.name }, update: {}, create: d }),
    );
  }

  const doctorsData = [
    { email: 'bs.an@clinic.local', fullName: 'BS. Nguyễn Văn An', title: 'Thạc sĩ - Bác sĩ', deptIndex: 0 },
    { email: 'bs.binh@clinic.local', fullName: 'BS. Trần Thị Bình', title: 'Bác sĩ CKI', deptIndex: 1 },
    { email: 'bs.chi@clinic.local', fullName: 'BS. Lê Thị Chi', title: 'Bác sĩ CKII', deptIndex: 2 },
  ];

  for (const d of doctorsData) {
    const user = await upsertUserWithRole(d.email, 'Doctor@123', d.fullName, Role.DOCTOR, '0900000000');
    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: { departmentId: departments[d.deptIndex].id, title: d.title },
      create: { userId: user.id, departmentId: departments[d.deptIndex].id, title: d.title },
    });
    await ensureShiftsForDoctor(doctor.id);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
