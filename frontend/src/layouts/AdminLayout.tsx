import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const adminItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Tổng quan</Link> },
    { key: '/admin/departments', icon: <ApartmentOutlined />, label: <Link to="/admin/departments">Chuyên khoa</Link> },
    { key: '/admin/doctors', icon: <TeamOutlined />, label: <Link to="/admin/doctors">Bác sĩ</Link> },
    { key: '/admin/appointments', icon: <CalendarOutlined />, label: <Link to="/admin/appointments">Lịch hẹn</Link> },
    { key: '/admin/patients', icon: <UserOutlined />, label: <Link to="/admin/patients">Bệnh nhân</Link> },
  ];
  const doctorItems: MenuProps['items'] = [
    { key: '/doctor/schedule', icon: <ScheduleOutlined />, label: <Link to="/doctor/schedule">Lịch khám hôm nay</Link> },
  ];

  const items = user?.role === 'DOCTOR' ? doctorItems : adminItems;
  const selectedKey =
    items
      ?.filter((i): i is NonNullable<typeof i> => !!i && location.pathname.startsWith(String(i.key)))
      .sort((a, b) => String(b.key).length - String(a.key).length)[0]?.key ?? items?.[0]?.key;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" collapsed={collapsed} onCollapse={setCollapsed} width={232}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 20px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: BRAND_GRADIENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MedicineBoxOutlined />
          </div>
          {!collapsed && <span>{user?.role === 'DOCTOR' ? 'Khu vực Bác sĩ' : 'Khu vực Quản trị'}</span>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[String(selectedKey)]} items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
            <ArrowLeftOutlined /> Về trang chủ
          </Link>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Đăng xuất',
                  onClick: () => {
                    logout();
                    navigate('/login');
                  },
                },
              ],
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size="small" style={{ backgroundColor: '#0d9488' }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <span style={{ color: '#0f172a' }}>{user?.fullName}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content className="app-fade-in" style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
