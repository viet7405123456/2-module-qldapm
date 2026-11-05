import client from './client';
import type { AppointmentSlot, Doctor, DoctorShift, Shift } from '../types';

export interface CreateDoctorPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  departmentId: string;
  title?: string;
  bio?: string;
}

export interface UpdateDoctorPayload {
  fullName?: string;
  phone?: string;
  departmentId?: string;
  title?: string;
  bio?: string;
}

export async function listDoctors(departmentId?: string): Promise<Doctor[]> {
  const { data } = await client.get<Doctor[]>('/doctors', {
    params: departmentId ? { departmentId } : undefined,
  });
  return data;
}

export async function getDoctor(id: string): Promise<Doctor> {
  const { data } = await client.get<Doctor>(`/doctors/${id}`);
  return data;
}

export async function createDoctor(payload: CreateDoctorPayload): Promise<Doctor> {
  const { data } = await client.post<Doctor>('/doctors', payload);
  return data;
}

export async function updateDoctor(id: string, payload: UpdateDoctorPayload): Promise<Doctor> {
  const { data } = await client.put<Doctor>(`/doctors/${id}`, payload);
  return data;
}

export async function deleteDoctor(id: string): Promise<void> {
  await client.delete(`/doctors/${id}`);
}

export interface CreateShiftPayload {
  workDate: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  capacityPerSlot: number;
}

export async function listDoctorShifts(
  doctorId: string,
  from?: string,
  to?: string,
): Promise<DoctorShift[]> {
  const { data } = await client.get<DoctorShift[]>(`/doctors/${doctorId}/shifts`, {
    params: { from, to },
  });
  return data;
}

export async function createDoctorShift(
  doctorId: string,
  payload: CreateShiftPayload,
): Promise<DoctorShift> {
  const { data } = await client.post<DoctorShift>(`/doctors/${doctorId}/shifts`, payload);
  return data;
}

export async function deleteShift(shiftId: string): Promise<void> {
  await client.delete(`/shifts/${shiftId}`);
}

export async function listDoctorSlots(
  doctorId: string,
  date: string,
): Promise<AppointmentSlot[]> {
  const { data } = await client.get<AppointmentSlot[]>(`/doctors/${doctorId}/slots`, {
    params: { date },
  });
  return data;
}
