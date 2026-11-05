import React, { useState } from 'react';
import { Table, Tag, DatePicker, Button, Space, message, Card } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { doctorAppointmentsForDate, updateAppointmentStatus } from '../../api/appointments';
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

export default function MySchedule() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const queryClient = useQueryClient();
  const dateStr = date.format('YYYY-MM-DD');

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', dateStr],
    queryFn: () => doctorAppointmentsForDate(dateStr),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments', dateStr] });
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const columns = [
    {
      title: 'Giờ',
      key: 'time',
      render: (_: unknown, record: Appointment) =>
        record.slotStartTime ? dayjs(record.slotStartTime).format('HH:mm') : '-',
    },
    { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
    { title: 'SĐT', dataIndex: 'patientPhone', key: 'patientPhone' },
    { title: 'Lý do khám', dataIndex: 'reason', key: 'reason', render: (v?: string) => v || '-' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: AppointmentStatus) => <Tag color={statusColor[s]}>{statusLabel[s]}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Appointment) =>
        record.status === 'CONFIRMED' || record.status === 'PENDING' ? (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => statusMutation.mutate({ id: record.id, status: 'COMPLETED' })}
            >
              Đã khám
            </Button>
            <Button size="small" onClick={() => statusMutation.mutate({ id: record.id, status: 'NO_SHOW' })}>
              Không đến
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<ScheduleOutlined />}
        title="Lịch khám của tôi"
        description="Danh sách bệnh nhân đã đăng ký khám với bạn"
        extra={<DatePicker value={date} onChange={(d) => d && setDate(d)} format="DD/MM/YYYY" allowClear={false} />}
      />
      <Card className="soft-card">
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={data}
          columns={columns}
          locale={{ emptyText: 'Không có lịch hẹn nào trong ngày này' }}
        />
      </Card>
    </div>
  );
}
