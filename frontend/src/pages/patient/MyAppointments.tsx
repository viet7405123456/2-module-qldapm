import React from 'react';
import { Table, Tag, Button, Popconfirm, message, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { myAppointments, cancelAppointment } from '../../api/appointments';
import type { Appointment, AppointmentStatus } from '../../types';
import PageHeader from '../../components/PageHeader';

const statusColor: Record<AppointmentStatus, string> = {
  PENDING: 'gold',
  CONFIRMED: 'blue',
  COMPLETED: 'green',
  NO_SHOW: 'red',
  CANCELLED: 'default',
};

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Đã khám',
  NO_SHOW: 'Không đến',
  CANCELLED: 'Đã hủy',
};

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my-appointments'], queryFn: myAppointments });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      message.success('Đã hủy lịch hẹn');
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message ?? 'Không thể hủy lịch hẹn');
    },
  });

  const columns = [
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
      render: (status: AppointmentStatus) => <Tag color={statusColor[status]}>{statusLabel[status]}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Appointment) =>
        record.status === 'PENDING' || record.status === 'CONFIRMED' ? (
          <Popconfirm title="Hủy lịch hẹn này?" onConfirm={() => cancelMutation.mutate(record.id)}>
            <Button danger size="small">
              Hủy
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<FileTextOutlined />}
        title="Lịch hẹn của tôi"
        description="Danh sách các lịch khám bạn đã đặt"
      />
      <Card className="soft-card">
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={data}
          columns={columns}
          locale={{ emptyText: 'Bạn chưa có lịch hẹn nào' }}
        />
      </Card>
    </div>
  );
}
