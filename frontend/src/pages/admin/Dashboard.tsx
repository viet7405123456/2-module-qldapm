import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import {
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { listDepartments } from '../../api/departments';
import { listDoctors } from '../../api/doctors';
import { adminListAppointments } from '../../api/appointments';
import PageHeader from '../../components/PageHeader';

export default function Dashboard() {
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: listDepartments });
  const { data: doctors } = useQuery({ queryKey: ['doctors-all'], queryFn: () => listDoctors() });
  const today = dayjs().format('YYYY-MM-DD');
  const { data: todayAppointments } = useQuery({
    queryKey: ['admin-appointments', { date: today, pageSize: 500 }],
    queryFn: () => adminListAppointments({ date: today, pageSize: 500 }),
  });

  const pendingToday = todayAppointments?.items.filter((a) => a.status === 'PENDING').length ?? 0;

  const cards = [
    {
      title: 'Tổng số chuyên khoa',
      value: departments?.length ?? 0,
      icon: <ApartmentOutlined />,
      color: '#0d9488',
    },
    {
      title: 'Tổng số bác sĩ',
      value: doctors?.length ?? 0,
      icon: <TeamOutlined />,
      color: '#2563eb',
    },
    {
      title: 'Lịch hẹn hôm nay',
      value: todayAppointments?.total ?? 0,
      icon: <CalendarOutlined />,
      color: '#7c3aed',
    },
    {
      title: 'Chờ xác nhận hôm nay',
      value: pendingToday,
      icon: <ClockCircleOutlined />,
      color: '#d97706',
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<DashboardOutlined />}
        title="Tổng quan hệ thống"
        description="Theo dõi nhanh số liệu hoạt động hôm nay"
      />
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col xs={24} sm={12} lg={6} key={c.title}>
            <Card className="soft-card">
              <Statistic
                title={c.title}
                value={c.value}
                prefix={<span style={{ color: c.color, marginRight: 4 }}>{c.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
