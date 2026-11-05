import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import Profile from './pages/patient/Profile';

import Dashboard from './pages/admin/Dashboard';
import Departments from './pages/admin/Departments';
import Doctors from './pages/admin/Doctors';
import DoctorSchedule from './pages/admin/DoctorSchedule';
import Appointments from './pages/admin/Appointments';
import Patients from './pages/admin/Patients';
import PatientDetail from './pages/admin/PatientDetail';

import MySchedule from './pages/doctor/MySchedule';

export default function App() {
  return (
    <ConfigProvider locale={viVN} theme={theme}>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/doctors" element={<Doctors />} />
            <Route path="/admin/doctors/:id/schedule" element={<DoctorSchedule />} />
            <Route path="/admin/appointments" element={<Appointments />} />
            <Route path="/admin/patients" element={<Patients />} />
            <Route path="/admin/patients/:id" element={<PatientDetail />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/doctor/schedule" element={<MySchedule />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
}
