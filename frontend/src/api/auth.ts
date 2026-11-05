import client from './client';
import type { AuthResponse, RegisterPayload, User } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function me(): Promise<User> {
  const { data } = await client.get<User>('/auth/me');
  return data;
}
