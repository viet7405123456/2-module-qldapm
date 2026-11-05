import client from './client';
import type { Appointment, AppointmentStatus } from '../types';

export interface AdminAppointmentFilters {
  date?: string;
  doctorId?: string;
  departmentId?: string;
  status?: AppointmentStatus;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export async function bookAppointment(slotId: string, reason?: string): Promise<Appointment> {
  const { data } = await client.post<Appointment>('/appointments', { slotId, reason });
  return data;
}

export async function myAppointments(): Promise<Appointment[]> {
  const { data } = await client.get<Appointment[]>('/appointments/me');
  return data;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/appointments/${id}/cancel`);
  return data;
}

export async function adminListAppointments(
  filters: AdminAppointmentFilters,
): Promise<Paginated<Appointment>> {
  const { data } = await client.get<Paginated<Appointment>>('/appointments', {
    params: filters,
  });
  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/appointments/${id}/status`, { status });
  return data;
}

export async function doctorAppointmentsForDate(date: string): Promise<Appointment[]> {
  const { data } = await client.get<Appointment[]>('/appointments/doctor/me', {
    params: { date },
  });
  return data;
}
