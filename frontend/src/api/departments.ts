import client from './client';
import type { Department } from '../types';

export async function listDepartments(): Promise<Department[]> {
  const { data } = await client.get<Department[]>('/departments');
  return data;
}

export async function createDepartment(payload: Omit<Department, 'id'>): Promise<Department> {
  const { data } = await client.post<Department>('/departments', payload);
  return data;
}

export async function updateDepartment(
  id: string,
  payload: Omit<Department, 'id'>,
): Promise<Department> {
  const { data } = await client.put<Department>(`/departments/${id}`, payload);
  return data;
}

export async function deleteDepartment(id: string): Promise<void> {
  await client.delete(`/departments/${id}`);
}
