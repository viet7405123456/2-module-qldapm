import React, { useState } from 'react';
import { Table, Tag, Select, DatePicker, Button, Space, message, Card } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { listDepartments } from '../../api/departments';
import { listDoctors } from '../../api/doctors';
import { adminListAppointments, updateAppointmentStatus } from '../../api/appointments';
import type { Appointment, AppointmentStatus } from '../../types';
import PageHeader from '../../components/PageHeader';

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Đã khám',
  NO_SHOW: 'Không đến',
  CANCELLED: 'Đã hủy',
};

const statusColor: Record<AppointmentStatus, string> = {
  PENDING: 'gold',
  CONFIRMED: 'blue',
  COMPLETED: 'green',
  NO_SHOW: 'red',
  CANCELLED: 'default',
};

export default function Appointments() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [departmentId, setDepartmentId] = useState<string>();
  const [doctorId, setDoctorId] = useState<string>();
  const [status, setStatus] = useState<AppointmentStatus>();

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: listDepartments });
  const { data: doctors } = useQuery({ queryKey: ['doctors-all'], queryFn: () => listDoctors() });

  const filters = {
    date: date ? date.format('YYYY-MM-DD') : undefined,
    departmentId,
    doctorId,
    status,
    pageSize: 200,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', filters],
    queryFn: () => adminListAppointments(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const columns = [
    { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
    { title: 'SĐT', dataIndex: 'patientPhone', key: 'patientPhone' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Chuyên khoa', dataIndex: 'departmentName', key: 'departmentName' },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: unknown, record: Appointment) =>
        record.slotStartTime ? dayjs(record.slotStartTime).format('HH:mm DD/MM/YYYY') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: AppointmentStatus) => <Tag color={statusColor[s]}>{statusLabel[s]}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Appointment) => (
        <Space>
          {record.status === 'PENDING' && (
            <Button size="small" type="primary" onClick={() => statusMutation.mutate({ id: record.id, status: 'CONFIRMED' })}>
              Xác nhận
            </Button>
          )}
          {record.status !== 'CANCELLED' && record.status !== 'COMPLETED' && (
            <Button
              size="small"
              danger
              onClick={() => statusMutation.mutate({ id: record.id, status: 'CANCELLED' })}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<CalendarOutlined />}
        title="Quản lý lịch hẹn"
        description="Theo dõi, lọc và cập nhật trạng thái lịch hẹn của bệnh nhân"
      />
      <Card className="soft-card">
        <Space style={{ marginBottom: 16 }} wrap>
          <DatePicker value={date} onChange={setDate} format="DD/MM/YYYY" placeholder="Chọn ngày" />
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder="Chuyên khoa"
            value={departmentId}
            onChange={setDepartmentId}
            options={departments?.map((d) => ({ value: d.id, label: d.name }))}
          />
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder="Bác sĩ"
            value={doctorId}
            onChange={setDoctorId}
            options={doctors?.map((d) => ({ value: d.id, label: d.fullName }))}
          />
          <Select
            allowClear
            style={{ width: 160 }}
            placeholder="Trạng thái"
            value={status}
            onChange={setStatus}
            options={Object.entries(statusLabel).map(([value, label]) => ({ value, label }))}
          />
        </Space>
        <Table rowKey="id" loading={isLoading} dataSource={data?.items} columns={columns} />
      </Card>
    </div>
  );
}
