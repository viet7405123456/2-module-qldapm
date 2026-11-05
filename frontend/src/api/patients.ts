import client from './client';
import type { PatientProfile } from '../types';

export async function myProfile(): Promise<PatientProfile> {
  const { data } = await client.get<PatientProfile>('/patients/me');
  return data;
}

export async function updateMyProfile(
  payload: Partial<Omit<PatientProfile, 'id' | 'userId' | 'email'>>,
): Promise<PatientProfile> {
  const { data } = await client.patch<PatientProfile>('/patients/me', payload);
  return data;
}

export async function listPatients(search?: string): Promise<PatientProfile[]> {
  const { data } = await client.get<PatientProfile[]>('/patients', {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function getPatient(id: string): Promise<PatientProfile> {
  const { data } = await client.get<PatientProfile>(`/patients/${id}`);
  return data;
}
