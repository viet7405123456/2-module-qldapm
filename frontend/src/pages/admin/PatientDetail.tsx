import React from 'react';
import { Card, Descriptions, Table, Tag, Space, Avatar, Typography, Button } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getPatient } from '../../api/patients';
import type { Appointment, AppointmentStatus } from '../../types';
import PageHeader from '../../components/PageHeader';

const { Title } = Typography;

const genderLabel: Record<string, string> = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };

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

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatient(id as string),
  });

  const historyColumns = [
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: unknown, record: Appointment) =>
        record.slotStartTime ? dayjs(record.slotStartTime).format('HH:mm DD/MM/YYYY') : '-',
    },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Chuyên khoa', dataIndex: 'departmentName', key: 'departmentName' },
    { title: 'Lý do khám', dataIndex: 'reason', key: 'reason', render: (v?: string) => v || '-' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: AppointmentStatus) => <Tag color={statusColor[s]}>{statusLabel[s]}</Tag>,
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<UserOutlined />}
        title="Hồ sơ bệnh nhân"
        description="Thông tin hành chính và lịch sử lịch hẹn"
        extra={
          <Link to="/admin/patients">
            <Button icon={<ArrowLeftOutlined />}>Danh sách bệnh nhân</Button>
          </Link>
        }
      />
      <Card className="soft-card" loading={isLoading} style={{ marginBottom: 20 }}>
        {data && (
          <>
            <Space align="center" style={{ marginBottom: 16 }}>
              <Avatar size={48} style={{ backgroundColor: '#0d9488' }}>
                {data.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <Title level={4} style={{ margin: 0 }}>
                {data.fullName}
              </Title>
            </Space>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{data.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {data.gender ? genderLabel[data.gender] ?? data.gender : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {data.address || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Số CCCD/CMND" span={2}>
                {data.idNumber || '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      <Card
        className="soft-card"
        title="Lịch sử lịch hẹn"
        styles={{ header: { fontWeight: 600 } }}
      >
        <Table
          rowKey="id"
          dataSource={data?.appointments}
          columns={historyColumns}
          locale={{ emptyText: 'Bệnh nhân chưa có lịch hẹn nào' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
