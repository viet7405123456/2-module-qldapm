import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message, Space, Card } from 'antd';
import { ApartmentOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../api/departments';
import type { Department } from '../../types';
import PageHeader from '../../components/PageHeader';

export default function Departments() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['departments'], queryFn: listDepartments });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form] = Form.useForm();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['departments'] });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      message.success('Đã tạo chuyên khoa');
      invalidate();
      setOpen(false);
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<Department, 'id'> }) =>
      updateDepartment(id, payload),
    onSuccess: () => {
      message.success('Đã cập nhật');
      invalidate();
      setOpen(false);
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
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

  const openEdit = (dep: Department) => {
    setEditing(dep);
    form.setFieldsValue(dep);
    setOpen(true);
  };

  const onFinish = (values: Omit<Department, 'id'>) => {
    if (editing) updateMutation.mutate({ id: editing.id, payload: values });
    else createMutation.mutate(values);
  };

  const columns = [
    { title: 'Tên chuyên khoa', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_: unknown, record: Department) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa chuyên khoa này?" onConfirm={() => deleteMutation.mutate(record.id)}>
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
        icon={<ApartmentOutlined />}
        title="Quản lý chuyên khoa"
        description="Thêm, chỉnh sửa danh mục các chuyên khoa khám bệnh"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm chuyên khoa
          </Button>
        }
      />
      <Card className="soft-card">
        <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      </Card>
      <Modal
        title={editing ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Tên chuyên khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
