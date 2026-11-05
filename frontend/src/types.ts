export type Role = 'PATIENT' | 'ADMIN' | 'DOCTOR';

export type Shift = 'MORNING' | 'AFTERNOON';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId: string;
  departmentName?: string;
  title?: string;
  bio?: string;
}

export interface DoctorShift {
  id: string;
  doctorId: string;
  workDate: string; // YYYY-MM-DD
  shift: Shift;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDurationMinutes: number;
  capacityPerSlot: number;
}

export interface AppointmentSlot {
  id: string;
  startTime: string; // ISO datetime
  endTime: string;
  capacity: number;
  bookedCount: number;
  full: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  doctorId: string;
  doctorName?: string;
  departmentId: string;
  departmentName?: string;
  slotId: string;
  slotStartTime?: string;
  slotEndTime?: string;
  status: AppointmentStatus;
  reason?: string;
  createdAt?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  idNumber?: string;
  /** Only present on GET /patients/:id (admin detail view). */
  appointments?: Appointment[];
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  idNumber?: string;
}
