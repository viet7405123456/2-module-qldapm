import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LoginOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      message.success('Đăng nhập thành công');
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DOCTOR') navigate('/doctor/schedule');
      else navigate('/booking');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-bg">
      <Card className="soft-card" style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            className="icon-badge"
            style={{ background: BRAND_GRADIENT, margin: '0 auto 14px' }}
          >
            <LoginOutlined />
          </div>
          <Title level={3} style={{ margin: 0 }}>
            Đăng nhập
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 4 }}>
            Đăng nhập để đặt lịch và quản lý lịch hẹn của bạn
          </Paragraph>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} autoFocus placeholder="ban@email.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: 'block', textAlign: 'center' }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </Text>
      </Card>
    </div>
  );
}
