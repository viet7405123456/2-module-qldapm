import React from 'react';
import { Layout, Menu, Button, Space, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuProps['items'] = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
  ];
  if (isAuthenticated && user?.role === 'PATIENT') {
    items.push(
      { key: '/booking', icon: <CalendarOutlined />, label: <Link to="/booking">Đặt lịch khám</Link> },
      {
        key: '/my-appointments',
        icon: <FileTextOutlined />,
        label: <Link to="/my-appointments">Lịch hẹn của tôi</Link>,
      },
      { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">Hồ sơ cá nhân</Link> },
    );
  }
  if (isAuthenticated && user?.role === 'ADMIN') {
    items.push({ key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Trang quản trị</Link> });
  }
  if (isAuthenticated && user?.role === 'DOCTOR') {
    items.push({
      key: '/doctor/schedule',
      icon: <ScheduleOutlined />,
      label: <Link to="/doctor/schedule">Lịch khám của tôi</Link>,
    });
  }

  const selectedKey = items
    .filter((i): i is NonNullable<typeof i> => !!i && location.pathname.startsWith(String(i.key)))
    .sort((a, b) => String(b.key).length - String(a.key).length)[0]?.key ?? '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
          padding: '0 24px',
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 36, flexShrink: 0 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: BRAND_GRADIENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
            }}
          >
            <MedicineBoxOutlined />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Phòng khám Đa khoa</span>
        </Link>
        <Menu
          mode="horizontal"
          items={items}
          selectedKeys={[String(selectedKey)]}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
        />
        <Space>
          {isAuthenticated ? (
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
          ) : (
            <Space>
              <Link to="/login">
                <Button>Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Đăng ký</Button>
              </Link>
            </Space>
          )}
        </Space>
      </Header>
      <Content
        className="app-fade-in"
        style={{ padding: '32px 48px', maxWidth: 1240, margin: '0 auto', width: '100%' }}
      >
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', color: '#94a3b8', background: 'transparent' }}>
        Website Đăng ký Khám chữa bệnh © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
