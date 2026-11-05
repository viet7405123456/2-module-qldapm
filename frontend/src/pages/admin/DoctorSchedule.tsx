import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  TimePicker,
  Popconfirm,
  message,
  Tag,
  Card,
  Space,
} from 'antd';
import { ScheduleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getDoctor, listDoctorShifts, createDoctorShift, deleteShift } from '../../api/doctors';
import PageHeader from '../../components/PageHeader';

export default function DoctorSchedule() {
  const { id } = useParams<{ id: string }>();
  const doctorId = id as string;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: doctor } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctor(doctorId),
  });

  const from = dayjs().format('YYYY-MM-DD');
  const to = dayjs().add(30, 'day').format('YYYY-MM-DD');
  const { data: shifts, isLoading } = useQuery({
    queryKey: ['doctor-shifts', doctorId],
    queryFn: () => listDoctorShifts(doctorId, from, to),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => createDoctorShift(doctorId, payload),
    onSuccess: () => {
      message.success('Đã tạo ca làm việc');
      queryClient.invalidateQueries({ queryKey: ['doctor-shifts', doctorId] });
      setOpen(false);
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShift,
    onSuccess: () => {
      message.success('Đã xóa ca làm việc');
      queryClient.invalidateQueries({ queryKey: ['doctor-shifts', doctorId] });
    },
    onError: (err: any) => message.error(err?.response?.data?.message ?? 'Không thể xóa'),
  });

  const onFinish = (values: any) => {
    createMutation.mutate({
      workDate: dayjs(values.workDate).format('YYYY-MM-DD'),
      shift: values.shift,
      startTime: dayjs(values.startTime).format('HH:mm'),
      endTime: dayjs(values.endTime).format('HH:mm'),
      slotDurationMinutes: values.slotDurationMinutes,
      capacityPerSlot: values.capacityPerSlot,
    });
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'workDate',
      key: 'workDate',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Buổi',
      dataIndex: 'shift',
      key: 'shift',
      render: (v: string) => <Tag color={v === 'MORNING' ? 'gold' : 'blue'}>{v === 'MORNING' ? 'Sáng' : 'Chiều'}</Tag>,
    },
    { title: 'Bắt đầu', dataIndex: 'startTime', key: 'startTime' },
    { title: 'Kết thúc', dataIndex: 'endTime', key: 'endTime' },
    { title: 'Thời gian/slot (phút)', dataIndex: 'slotDurationMinutes', key: 'slotDurationMinutes' },
    { title: 'Số BN/slot', dataIndex: 'capacityPerSlot', key: 'capacityPerSlot' },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Popconfirm title="Xóa ca làm việc này?" onConfirm={() => deleteMutation.mutate(record.id)}>
          <Button size="small" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<ScheduleOutlined />}
        title={`Lịch làm việc — ${doctor?.fullName ?? ''}`}
        description="Cấu hình ca làm việc theo buổi, hệ thống tự sinh khung giờ đặt lịch"
        extra={
          <Space>
            <Link to="/admin/doctors">
              <Button icon={<ArrowLeftOutlined />}>Danh sách bác sĩ</Button>
            </Link>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
              Thêm ca làm việc
            </Button>
          </Space>
        }
      />
      <Card className="soft-card">
        <Table rowKey="id" loading={isLoading} dataSource={shifts} columns={columns} />
      </Card>
      <Modal
        title="Thêm ca làm việc"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ slotDurationMinutes: 30, capacityPerSlot: 1, shift: 'MORNING' }}
        >
          <Form.Item name="workDate" label="Ngày làm việc" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="shift" label="Buổi" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'MORNING', label: 'Sáng' },
                { value: 'AFTERNOON', label: 'Chiều' },
              ]}
            />
          </Form.Item>
          <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={5} />
          </Form.Item>
          <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={5} />
          </Form.Item>
          <Form.Item
            name="slotDurationMinutes"
            label="Thời gian mỗi slot (phút)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={5} max={120} />
          </Form.Item>
          <Form.Item
            name="capacityPerSlot"
            label="Số bệnh nhân tối đa mỗi slot"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={20} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
