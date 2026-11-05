import React from 'react';
import { Button, Typography, Space, Row, Col, Card } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  LoginOutlined,
  UserAddOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Title, Paragraph, Text } = Typography;

const steps = [
  {
    icon: <CalendarOutlined />,
    color: '#0d9488',
    title: '1. Chọn chuyên khoa & bác sĩ',
    desc: 'Lựa chọn chuyên khoa phù hợp và bác sĩ bạn muốn khám.',
  },
  {
    icon: <ClockCircleOutlined />,
    color: '#2563eb',
    title: '2. Chọn ngày giờ trống',
    desc: 'Xem khung giờ còn trống theo từng buổi sáng/chiều và chọn giờ phù hợp.',
  },
  {
    icon: <CheckCircleOutlined />,
    color: '#16a34a',
    title: '3. Xác nhận lịch hẹn',
    desc: 'Nhận xác nhận lịch hẹn và theo dõi trạng thái trong mục "Lịch hẹn của tôi".',
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <div
        className="hero-gradient"
        style={{
          padding: '56px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 420px', minWidth: 300 }}>
          <Text
            style={{
              color: '#0d9488',
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              fontSize: 13,
            }}
          >
            Đặt lịch khám trực tuyến 24/7
          </Text>
          <Title level={1} style={{ marginTop: 8, marginBottom: 16, fontSize: 40 }}>
            Phòng khám Đa khoa
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#475569', maxWidth: 480 }}>
            Đăng ký khám bệnh nhanh chóng: chọn chuyên khoa, chọn bác sĩ, chọn ngày giờ còn trống
            và xác nhận lịch hẹn chỉ trong vài bước — không cần xếp hàng chờ đợi.
          </Paragraph>
          <Space size="middle" wrap>
            {isAuthenticated && user?.role === 'PATIENT' ? (
              <Link to="/booking">
                <Button type="primary" size="large" icon={<CalendarOutlined />}>
                  Đặt lịch khám ngay
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button type="primary" size="large" icon={<UserAddOutlined />}>
                    Đăng ký tài khoản
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" icon={<LoginOutlined />}>
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </Space>
        </div>

        <div style={{ flex: '0 1 340px', minWidth: 280 }}>
          <Card className="soft-card" styles={{ body: { padding: 28 } }}>
            <div
              className="icon-badge"
              style={{ background: BRAND_GRADIENT, width: 56, height: 56, fontSize: 26, marginBottom: 16 }}
            >
              <MedicineBoxOutlined />
            </div>
            <Title level={4} style={{ marginTop: 0 }}>
              Vì sao đặt lịch online?
            </Title>
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              {[
                'Đặt lịch mọi lúc, mọi nơi, không cần gọi điện',
                'Thấy ngay khung giờ còn trống của từng bác sĩ',
                'Theo dõi và hủy lịch hẹn dễ dàng khi cần',
              ].map((text) => (
                <Space key={text} align="start">
                  <CheckCircleOutlined style={{ color: '#16a34a', marginTop: 4 }} />
                  <Text style={{ color: '#334155' }}>{text}</Text>
                </Space>
              ))}
            </Space>
          </Card>
        </div>
      </div>

      <Row gutter={[20, 20]} style={{ marginTop: 32 }}>
        {steps.map((s) => (
          <Col xs={24} md={8} key={s.title}>
            <Card className="soft-card feature-card" style={{ height: '100%' }}>
              <div className="icon-badge" style={{ background: s.color, marginBottom: 14 }}>
                {s.icon}
              </div>
              <Title level={5} style={{ marginBottom: 8 }}>
                {s.title}
              </Title>
              <Paragraph style={{ color: '#64748b', marginBottom: 0 }}>{s.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {!isAuthenticated && (
        <Card className="soft-card" style={{ marginTop: 24, textAlign: 'center', padding: '8px 0' }}>
          <Title level={4} style={{ marginBottom: 8 }}>
            Sẵn sàng đặt lịch khám?
          </Title>
          <Paragraph style={{ color: '#64748b', marginBottom: 16 }}>
            Tạo tài khoản miễn phí chỉ mất chưa đến 1 phút.
          </Paragraph>
          <Link to="/register">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
              Bắt đầu ngay
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
