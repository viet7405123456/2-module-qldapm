import React, { useState } from 'react';
import { Table, Input, Button, Card, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listPatients } from '../../api/patients';
import PageHeader from '../../components/PageHeader';

export default function Patients() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => listPatients(search || undefined),
  });

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#0d9488' }}>
            {name?.[0]?.toUpperCase()}
          </Avatar>
          {name}
        </Space>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: any) => (
        <Link to={`/admin/patients/${record.id}`}>
          <Button size="small">Xem hồ sơ</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<UserOutlined />}
        title="Quản lý bệnh nhân"
        description="Tra cứu hồ sơ và lịch sử lịch hẹn của bệnh nhân"
      />
      <Card className="soft-card">
        <Input.Search
          placeholder="Tìm theo tên, email, SĐT"
          style={{ width: 320, marginBottom: 16 }}
          onSearch={setSearch}
          allowClear
        />
        <Table rowKey="id" loading={isLoading} dataSource={data} columns={columns} />
      </Card>
    </div>
  );
}
