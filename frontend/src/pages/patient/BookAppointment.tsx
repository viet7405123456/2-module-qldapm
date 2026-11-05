import React, { useMemo, useState } from 'react';
import {
  Steps,
  Card,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Input,
  Result,
  Spin,
  Avatar,
  Tag,
  Typography,
  Empty,
  message,
} from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { listDepartments } from '../../api/departments';
import { listDoctors, listDoctorSlots } from '../../api/doctors';
import { bookAppointment } from '../../api/appointments';
import type { AppointmentSlot } from '../../types';
import PageHeader from '../../components/PageHeader';

const { Text, Title } = Typography;

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [departmentId, setDepartmentId] = useState<string>();
  const [doctorId, setDoctorId] = useState<string>();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [slot, setSlot] = useState<AppointmentSlot>();
  const [reason, setReason] = useState('');
  const [confirmedAppointmentId, setConfirmedAppointmentId] = useState<string>();

  const { data: departments, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: listDepartments,
  });

  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', departmentId],
    queryFn: () => listDoctors(departmentId),
    enabled: !!departmentId,
  });

  const dateStr = date ? date.format('YYYY-MM-DD') : undefined;
  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', doctorId, dateStr],
    queryFn: () => listDoctorSlots(doctorId as string, dateStr as string),
    enabled: !!doctorId && !!dateStr,
  });

  const selectedDepartment = departments?.find((d) => d.id === departmentId);
  const selectedDoctor = doctors?.find((d) => d.id === doctorId);

  const bookMutation = useMutation({
    mutationFn: () => bookAppointment(slot!.id, reason || undefined),
    onSuccess: (appt) => {
      setConfirmedAppointmentId(appt.id);
      setStep(4);
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message ?? 'Đặt lịch thất bại, vui lòng thử lại');
    },
  });

  const disabledDate = (d: Dayjs) => {
    const today = dayjs().startOf('day');
    return d.isBefore(today) || d.isAfter(today.add(14, 'day'));
  };

  const steps = useMemo(
    () => [
      { title: 'Chuyên khoa', icon: <ApartmentOutlined /> },
      { title: 'Bác sĩ', icon: <UserOutlined /> },
      { title: 'Ngày & giờ', icon: <ClockCircleOutlined /> },
      { title: 'Xác nhận', icon: <CheckCircleOutlined /> },
      { title: 'Hoàn tất', icon: <CalendarOutlined /> },
    ],
    [],
  );

  if (step === 4) {
    return (
      <Card className="soft-card">
        <Result
          status="success"
          title="Đặt lịch khám thành công!"
          subTitle={`Mã lịch hẹn: ${confirmedAppointmentId}`}
          extra={[
            <Button
              key="again"
              onClick={() => {
                setStep(0);
                setDepartmentId(undefined);
                setDoctorId(undefined);
                setDate(null);
                setSlot(undefined);
                setReason('');
                setConfirmedAppointmentId(undefined);
              }}
            >
              Đặt lịch khác
            </Button>,
          ]}
        />
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        icon={<CalendarOutlined />}
        title="Đặt lịch khám"
        description="Chọn chuyên khoa, bác sĩ và khung giờ còn trống phù hợp với bạn"
      />
      <Card className="soft-card">
        <Steps current={step} items={steps} style={{ marginBottom: 32 }} />

        {step === 0 && (
          <div>
            <Text strong>Chọn chuyên khoa bạn muốn khám</Text>
            <div style={{ marginTop: 12 }}>
              <Spin spinning={loadingDepartments}>
                <Select
                  size="large"
                  style={{ width: 360, maxWidth: '100%' }}
                  placeholder="Chọn chuyên khoa"
                  value={departmentId}
                  onChange={(v) => {
                    setDepartmentId(v);
                    setDoctorId(undefined);
                  }}
                  options={departments?.map((d) => ({ value: d.id, label: d.name }))}
                />
              </Spin>
            </div>
            <div style={{ marginTop: 20 }}>
              <Button type="primary" size="large" disabled={!departmentId} onClick={() => setStep(1)}>
                Tiếp theo
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <Text strong>Chọn bác sĩ thuộc chuyên khoa "{selectedDepartment?.name}"</Text>
            <div style={{ marginTop: 12 }}>
              <Spin spinning={loadingDoctors}>
                {doctors?.length === 0 && (
                  <Empty description="Chuyên khoa này chưa có bác sĩ" style={{ margin: '24px 0' }} />
                )}
                <Row gutter={[16, 16]}>
                  {doctors?.map((doc) => (
                    <Col xs={24} sm={12} md={8} key={doc.id}>
                      <Card
                        hoverable
                        className="soft-card doctor-pick-card"
                        onClick={() => setDoctorId(doc.id)}
                        style={{
                          borderColor: doctorId === doc.id ? '#0d9488' : undefined,
                          borderWidth: doctorId === doc.id ? 2 : 1,
                        }}
                      >
                        <Avatar size={44} style={{ backgroundColor: '#0d9488', marginBottom: 10 }}>
                          {doc.fullName?.[0]?.toUpperCase()}
                        </Avatar>
                        <div style={{ fontWeight: 600 }}>
                          {doc.title ? `${doc.title} ` : ''}
                          {doc.fullName}
                        </div>
                        {doc.bio && (
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {doc.bio}
                          </Text>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </div>
            <div style={{ marginTop: 20 }}>
              <Button size="large" onClick={() => setStep(0)} style={{ marginRight: 8 }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" disabled={!doctorId} onClick={() => setStep(2)}>
                Tiếp theo
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Text strong>Chọn ngày khám</Text>
            <div style={{ marginTop: 12 }}>
              <DatePicker
                size="large"
                value={date}
                onChange={(d) => setDate(d)}
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <Text strong>Chọn khung giờ còn trống</Text>
              <div style={{ marginTop: 12 }}>
                <Spin spinning={loadingSlots}>
                  {slots?.length === 0 && dateStr && (
                    <Empty description="Không có khung giờ trống ngày này" style={{ margin: '24px 0' }} />
                  )}
                  <Row gutter={[8, 8]}>
                    {slots?.map((s) => (
                      <Col key={s.id}>
                        <Button
                          size="large"
                          type={slot?.id === s.id ? 'primary' : 'default'}
                          disabled={s.full}
                          onClick={() => setSlot(s)}
                        >
                          {dayjs(s.startTime).format('HH:mm')} - {dayjs(s.endTime).format('HH:mm')}
                          {s.full ? ' (hết chỗ)' : ''}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Spin>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <Button size="large" onClick={() => setStep(1)} style={{ marginRight: 8 }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" disabled={!slot} onClick={() => setStep(3)}>
                Tiếp theo
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <Title level={5} style={{ marginTop: 0 }}>
              Xác nhận thông tin lịch hẹn
            </Title>
            <Card style={{ background: '#f8fafc', marginBottom: 16 }} styles={{ body: { padding: 18 } }}>
              <Row gutter={[16, 10]}>
                <Col span={8}>
                  <Text type="secondary">Chuyên khoa</Text>
                </Col>
                <Col span={16}>
                  <Tag color="teal">{selectedDepartment?.name}</Tag>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Bác sĩ</Text>
                </Col>
                <Col span={16}>
                  <Text strong>
                    {selectedDoctor?.title ? `${selectedDoctor.title} ` : ''}
                    {selectedDoctor?.fullName}
                  </Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Thời gian</Text>
                </Col>
                <Col span={16}>
                  <Text strong>
                    {slot && dayjs(slot.startTime).format('HH:mm DD/MM/YYYY')} -{' '}
                    {slot && dayjs(slot.endTime).format('HH:mm')}
                  </Text>
                </Col>
              </Row>
            </Card>
            <Text strong>Lý do khám (không bắt buộc)</Text>
            <Input.TextArea
              placeholder="Mô tả ngắn gọn triệu chứng hoặc lý do bạn muốn khám..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ marginTop: 8 }}
            />
            <div style={{ marginTop: 20 }}>
              <Button size="large" onClick={() => setStep(2)} style={{ marginRight: 8 }}>
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                loading={bookMutation.isPending}
                onClick={() => bookMutation.mutate()}
              >
                Xác nhận đặt lịch
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
