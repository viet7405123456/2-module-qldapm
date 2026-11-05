import React, { useEffect } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, message, Avatar, Space, Typography } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { myProfile, updateMyProfile } from '../../api/patients';
import PageHeader from '../../components/PageHeader';

const { Text } = Typography;

export default function Profile() {
  const [form] = Form.useForm();
  const { data, isLoading } = useQuery({ queryKey: ['my-profile'], queryFn: myProfile });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
      });
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => message.success('Đã lưu thông tin hồ sơ'),
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Lưu thất bại'),
  });

  const onFinish = (values: any) => {
    updateMutation.mutate({
      fullName: values.fullName,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
      gender: values.gender,
      address: values.address,
      idNumber: values.idNumber,
    });
  };

  return (
    <div>
      <PageHeader icon={<UserOutlined />} title="Hồ sơ cá nhân" description="Cập nhật thông tin cá nhân của bạn" />
      <Card className="soft-card" loading={isLoading} style={{ maxWidth: 560 }}>
        <Space align="center" style={{ marginBottom: 20 }}>
          <Avatar size={48} style={{ backgroundColor: '#0d9488' }}>
            {data?.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{data?.fullName}</div>
            <Text type="secondary">{data?.email}</Text>
          </div>
        </Space>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select
              allowClear
              options={[
                { value: 'MALE', label: 'Nam' },
                { value: 'FEMALE', label: 'Nữ' },
                { value: 'OTHER', label: 'Khác' },
              ]}
            />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="idNumber" label="Số CCCD/CMND">
            <Input />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
