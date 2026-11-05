import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
  Card,
} from 'antd';
import { TeamOutlined, PlusOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listDepartments } from '../../api/departments';
import {
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  CreateDoctorPayload,
} from '../../api/doctors';
import type { Doctor } from '../../types';
import PageHeader from '../../components/PageHeader';

export default function Doctors() {
  const queryClient = useQueryClient();
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: listDepartments });
  const { data, isLoading } = useQuery({ queryKey: ['doctors-all'], queryFn: () => listDoctors() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form] = Form.useForm();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['doctors-all'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateDoctorPayload) => createDoctor(payload),
    onSuccess: () => {
      message.success('Đã tạo bác sĩ');
      invalidate();
      setOpen(false);
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateDoctor(id, payload),
    onSuccess: () => {
      message.success('Đã cập nhật');
      invalidate();
      setOpen(false);
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      message.success('Đã xóa');
      invalidate();
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Không thể xóa'),
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditing(doc);
    form.setFieldsValue(doc);
    setOpen(true);
  };

  const onFinish = (values: any) => {
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        payload: {
          fullName: values.fullName,
          phone: values.phone,
          departmentId: values.departmentId,
          title: values.title,
          bio: values.bio,
        },
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Chuyên khoa', dataIndex: 'departmentName', key: 'departmentName' },
    { title: 'Chức danh', dataIndex: 'title', key: 'title' },
    {
      title: '',
      key: 'actions',
      width: 280,
      render: (_: unknown, record: Doctor) => (
        <Space>
          <Link to={`/admin/doctors/${record.id}/schedule`}>
            <Button size="small" icon={<ScheduleOutlined />}>
              Lịch làm việc
            </Button>
          </Link>
          <Button size="small" onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa bác sĩ này?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<TeamOutlined />}
        title="Quản lý bác sĩ"
        description="Thêm bác sĩ mới và quản lý thông tin chuyên môn"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm bác sĩ
          </Button>
        }
      />
      <Card className="soft-card">
        <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      </Card>
      <Modal
        title={editing ? 'Sửa bác sĩ' : 'Thêm bác sĩ'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {!editing && (
            <>
              <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="departmentId" label="Chuyên khoa" rules={[{ required: true }]}>
            <Select options={departments?.map((d) => ({ value: d.id, label: d.name }))} />
          </Form.Item>
          <Form.Item name="title" label="Chức danh">
            <Input placeholder="VD: Thạc sĩ, Bác sĩ CKI..." />
          </Form.Item>
          <Form.Item name="bio" label="Giới thiệu">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
