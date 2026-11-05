import React, { useState } from 'react';
import { Button, Card, Form, Input, DatePicker, Select, Typography, message } from 'antd';
import { UserAddOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Title, Text, Paragraph } = Typography;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
        gender: values.gender,
        address: values.address,
        idNumber: values.idNumber,
      });
      message.success('Đăng ký thành công');
      navigate('/booking');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-bg">
      <Card className="soft-card" style={{ maxWidth: 560, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="icon-badge" style={{ background: BRAND_GRADIENT, margin: '0 auto 14px' }}>
            <UserAddOutlined />
          </div>
          <Title level={3} style={{ margin: 0 }}>
            Đăng ký tài khoản bệnh nhân
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 4 }}>
            Tạo tài khoản để bắt đầu đặt lịch khám trực tuyến
          </Paragraph>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="ban@email.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="09xxxxxxxx" />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select
              allowClear
              placeholder="Chọn giới tính"
              options={[
                { value: 'MALE', label: 'Nam' },
                { value: 'FEMALE', label: 'Nữ' },
                { value: 'OTHER', label: 'Khác' },
              ]}
            />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Số nhà, đường, phường/xã, tỉnh/thành" />
          </Form.Item>
          <Form.Item name="idNumber" label="Số CCCD/CMND">
            <Input />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: 'block', textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </Text>
      </Card>
    </div>
  );
}
