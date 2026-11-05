import React from 'react';
import { Space, Typography } from 'antd';
import { BRAND_GRADIENT } from '../theme';

const { Title, Text } = Typography;

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
}

export default function PageHeader({ icon, title, description, extra }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
      }}
    >
      <Space align="start" size={14}>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#fff',
              background: BRAND_GRADIENT,
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <Title level={3} style={{ margin: 0, lineHeight: 1.3 }}>
            {title}
          </Title>
          {description && (
            <Text type="secondary" style={{ fontSize: 14 }}>
              {description}
            </Text>
          )}
        </div>
      </Space>
      {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
    </div>
  );
}
