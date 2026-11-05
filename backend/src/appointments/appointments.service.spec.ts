import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AppointmentsService - booking concurrency', () => {
  let service: AppointmentsService;
  const slotState = { id: 'slot-1', capacity: 1, bookedCount: 0 };
  let appointmentIdCounter = 0;
  let lockQueue: Promise<void> = Promise.resolve();

  const fakePrisma: any = {
    $transaction: (fn: (tx: any) => Promise<any>) => {
      // Chain each call onto a shared queue so overlapping "transactions"
      // are serialized one at a time, the same way a real
      // `SELECT ... FOR UPDATE` row lock would serialize them in Postgres.
      const run = lockQueue.then(() => {
        const tx = {
          $queryRaw: jest.fn(async () => {
            return [{ id: slotState.id, capacity: slotState.capacity, bookedCount: slotState.bookedCount }];
          }),
          appointmentSlot: {
            findUnique: jest.fn(async () => ({
              id: slotState.id,
              startTime: new Date(Date.now() + 3600_000),
              doctorShift: { doctorId: 'doc-1', doctor: { departmentId: 'dep-1' } },
            })),
            update: jest.fn(async () => {
              slotState.bookedCount += 1;
            }),
          },
          appointment: {
            create: jest.fn(async (args: any) => ({
              id: `appt-${++appointmentIdCounter}`,
              ...args.data,
            })),
          },
        };
        return fn(tx);
      });
      lockQueue = run.then(
        () => undefined,
        () => undefined,
      );
      return run;
    },
  };

  beforeEach(async () => {
    slotState.bookedCount = 0;
    appointmentIdCounter = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, { provide: PrismaService, useValue: fakePrisma }],
    }).compile();
    service = module.get(AppointmentsService);
  });

  it('allows only one of two concurrent bookings on a capacity-1 slot', async () => {
    const results = await Promise.allSettled([
      service.book('patient-1', { slotId: 'slot-1' }),
      service.book('patient-2', { slotId: 'slot-1' }),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(ConflictException);
    expect(slotState.bookedCount).toBe(1);
  });
});
