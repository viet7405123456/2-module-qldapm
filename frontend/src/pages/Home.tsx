import React from 'react';
import { Button, Typography, Space, Row, Col, Card, Avatar, Rate, Collapse, Table, Tag } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  LoginOutlined,
  UserAddOutlined,
  MedicineBoxOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  SmileOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  SoundOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  TagsOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_GRADIENT } from '../theme';

const { Title, Paragraph, Text } = Typography;

// ---------------------------------------------------------------------------
// Static showcase content. Phần "Chuyên khoa" / "Bác sĩ" dùng đúng dữ liệu đã
// seed trong hệ thống; các mục còn lại (đánh giá, tin tức, FAQ...) là nội
// dung minh họa — nút/liên kết không gắn chức năng thật sẽ không điều hướng.
// ---------------------------------------------------------------------------

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

const stats = [
  { icon: <FieldTimeOutlined />, number: '15+', label: 'Năm kinh nghiệm' },
  { icon: <TeamOutlined />, number: '20+', label: 'Bác sĩ chuyên khoa' },
  { icon: <SmileOutlined />, number: '10.000+', label: 'Bệnh nhân tin tưởng' },
  { icon: <SafetyCertificateOutlined />, number: '24/7', label: 'Hỗ trợ cấp cứu' },
];

const specialties = [
  {
    icon: <HeartOutlined />,
    color: '#0d9488',
    name: 'Nội tổng quát',
    desc: 'Khám và điều trị các bệnh lý nội khoa tổng quát cho mọi lứa tuổi.',
  },
  {
    icon: <SmileOutlined />,
    color: '#2563eb',
    name: 'Nhi khoa',
    desc: 'Chăm sóc, khám và điều trị chuyên biệt dành cho trẻ em.',
  },
  {
    icon: <SoundOutlined />,
    color: '#f59e0b',
    name: 'Tai Mũi Họng',
    desc: 'Khám và điều trị các bệnh lý Tai - Mũi - Họng thường gặp.',
  },
];

const whyUs = [
  {
    icon: <TeamOutlined />,
    color: '#0d9488',
    title: 'Đội ngũ chuyên môn cao',
    desc: 'Bác sĩ giàu kinh nghiệm, được đào tạo bài bản theo từng chuyên khoa.',
  },
  {
    icon: <ThunderboltOutlined />,
    color: '#2563eb',
    title: 'Đặt lịch nhanh chóng',
    desc: 'Chỉ mất vài phút để đặt lịch khám, không cần xếp hàng chờ đợi.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    color: '#16a34a',
    title: 'Theo dõi minh bạch',
    desc: 'Trạng thái lịch hẹn, lịch sử khám được cập nhật rõ ràng, dễ tra cứu.',
  },
  {
    icon: <CustomerServiceOutlined />,
    color: '#f59e0b',
    title: 'Hỗ trợ tận tâm 24/7',
    desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc của bạn mọi lúc.',
  },
];

const doctors = [
  {
    initials: 'AN',
    color: '#0d9488',
    name: 'BS. Nguyễn Văn An',
    title: 'Thạc sĩ - Bác sĩ',
    specialty: 'Nội tổng quát',
  },
  {
    initials: 'TB',
    color: '#2563eb',
    name: 'BS. Trần Thị Bình',
    title: 'Bác sĩ CKI',
    specialty: 'Nhi khoa',
  },
  {
    initials: 'LC',
    color: '#f59e0b',
    name: 'BS. Lê Thị Chi',
    title: 'Bác sĩ CKII',
    specialty: 'Tai Mũi Họng',
  },
];

const testimonials = [
  {
    initials: 'NA',
    color: '#0d9488',
    name: 'Chị Nguyễn Thị A',
    role: 'Bệnh nhân Nội tổng quát',
    text: 'Đặt lịch online rất nhanh, không phải chờ đợi lâu như trước. Bác sĩ tư vấn tận tình, chu đáo.',
  },
  {
    initials: 'TB',
    color: '#2563eb',
    name: 'Anh Trần Văn B',
    role: 'Phụ huynh bệnh nhi',
    text: 'Theo dõi lịch khám cho con rất tiện lợi, nhận được thông báo nhắc lịch đầy đủ.',
  },
  {
    initials: 'PC',
    color: '#f59e0b',
    name: 'Chị Phạm Thị C',
    role: 'Bệnh nhân Tai Mũi Họng',
    text: 'Giao diện dễ sử dụng, chọn được đúng khung giờ trống mà không cần gọi điện hỏi trước.',
  },
];

const faqs = [
  {
    q: 'Tôi cần làm gì để đặt lịch khám?',
    a: 'Bạn chỉ cần đăng ký tài khoản, chọn chuyên khoa và bác sĩ phù hợp, sau đó chọn khung giờ còn trống và xác nhận lịch hẹn.',
  },
  {
    q: 'Tôi có thể hủy hoặc đổi lịch hẹn đã đặt không?',
    a: 'Có. Bạn có thể xem và quản lý lịch hẹn trong mục "Lịch hẹn của tôi" sau khi đăng nhập.',
  },
  {
    q: 'Thông tin cá nhân của tôi có được bảo mật không?',
    a: 'Mọi thông tin hồ sơ và lịch sử khám bệnh của bạn được bảo mật và chỉ phục vụ cho mục đích khám chữa bệnh.',
  },
  {
    q: 'Tôi quên mật khẩu thì phải làm sao?',
    a: 'Vui lòng liên hệ tổng đài hỗ trợ hoặc quản trị viên để được hỗ trợ khôi phục tài khoản.',
  },
];

const news = [
  {
    tag: 'Sức khỏe tim mạch',
    title: 'Tầm quan trọng của khám sức khỏe định kỳ',
    desc: 'Vì sao bạn nên khám sức khỏe định kỳ và những xét nghiệm cần thiết theo độ tuổi.',
  },
  {
    tag: 'Nhi khoa',
    title: 'Chế độ dinh dưỡng cho trẻ theo từng giai đoạn',
    desc: 'Những lưu ý quan trọng về dinh dưỡng giúp trẻ phát triển toàn diện.',
  },
  {
    tag: 'Tai Mũi Họng',
    title: 'Phòng ngừa viêm họng khi giao mùa',
    desc: 'Các biện pháp đơn giản giúp bảo vệ hệ hô hấp trong thời điểm giao mùa.',
  },
];

const priceColumns = [
  { title: 'Dịch vụ', dataIndex: 'service', key: 'service' },
  {
    title: 'Chi phí tham khảo',
    dataIndex: 'price',
    key: 'price',
    align: 'right' as const,
  },
];

const priceData = [
  { key: 1, service: 'Khám Nội tổng quát', price: '140.000đ' },
  { key: 2, service: 'Khám Nội (theo yêu cầu bác sĩ)', price: '160.000đ' },
  { key: 3, service: 'Khám Nhi khoa', price: '140.000đ' },
  { key: 4, service: 'Khám Tai Mũi Họng', price: '140.000đ' },
  { key: 5, service: 'Khám Tai Mũi Họng (theo yêu cầu bác sĩ)', price: '160.000đ' },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div style={{ textAlign: align, marginBottom: 32 }}>
      <Text className="section-eyebrow">{eyebrow}</Text>
      <Title level={2} style={{ marginTop: 8, marginBottom: subtitle ? 8 : 0, fontSize: 30 }}>
        {title}
      </Title>
      {subtitle && (
        <Paragraph
          style={{ color: '#64748b', fontSize: 15, maxWidth: 560, margin: align === 'center' ? '0 auto' : 0 }}
        >
          {subtitle}
        </Paragraph>
      )}
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* ---------- Hero ---------- */}
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
          <Text className="section-eyebrow">Đặt lịch khám trực tuyến 24/7</Text>
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

      {/* ---------- Stats strip ---------- */}
      <div className="stat-strip">
        {stats.map((s) => (
          <div className="stat-item" key={s.label}>
            <div
              className="icon-badge"
              style={{ background: BRAND_GRADIENT, margin: '0 auto 10px', width: 44, height: 44, fontSize: 20 }}
            >
              {s.icon}
            </div>
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ---------- Quy trình đặt lịch ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Quy trình đơn giản"
          title="Đặt lịch khám chỉ với 3 bước"
          subtitle="Không cần gọi điện, không cần xếp hàng — hoàn tất đặt lịch trong vài phút."
        />
        <Row gutter={[20, 20]}>
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
      </div>

      {/* ---------- Chuyên khoa nổi bật ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Chuyên khoa"
          title="Chuyên khoa nổi bật"
          subtitle="Các chuyên khoa đang tiếp nhận đặt lịch khám trực tuyến tại phòng khám."
        />
        <Row gutter={[20, 20]}>
          {specialties.map((sp) => (
            <Col xs={24} md={8} key={sp.name}>
              <Card className="soft-card feature-card" style={{ height: '100%' }}>
                <div className="icon-badge" style={{ background: sp.color, marginBottom: 14 }}>
                  {sp.icon}
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {sp.name}
                </Title>
                <Paragraph style={{ color: '#64748b', marginBottom: 16, minHeight: 44 }}>{sp.desc}</Paragraph>
                {isAuthenticated && user?.role === 'PATIENT' ? (
                  <Link to="/booking">
                    <Button type="link" style={{ padding: 0 }} icon={<ArrowRightOutlined />} iconPosition="end">
                      Đặt lịch khám
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button type="link" style={{ padding: 0 }} icon={<ArrowRightOutlined />} iconPosition="end">
                      Đặt lịch khám
                    </Button>
                  </Link>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ---------- Vì sao chọn chúng tôi ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Lý do tin tưởng"
          title="Tại sao chọn chúng tôi"
          subtitle="Những giá trị chúng tôi luôn đặt lên hàng đầu khi phục vụ bệnh nhân."
        />
        <Row gutter={[20, 20]}>
          {whyUs.map((w) => (
            <Col xs={24} sm={12} md={6} key={w.title}>
              <Card className="soft-card feature-card" style={{ height: '100%', textAlign: 'center' }}>
                <div
                  className="icon-badge"
                  style={{ background: w.color, margin: '0 auto 14px' }}
                >
                  {w.icon}
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {w.title}
                </Title>
                <Paragraph style={{ color: '#64748b', marginBottom: 0 }}>{w.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ---------- Đội ngũ bác sĩ ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Đội ngũ y bác sĩ"
          title="Bác sĩ chuyên môn tiêu biểu"
          subtitle="Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với từng chuyên khoa."
        />
        <Row gutter={[20, 20]}>
          {doctors.map((d) => (
            <Col xs={24} md={8} key={d.name}>
              <Card className="soft-card doctor-pick-card" style={{ height: '100%', textAlign: 'center' }}>
                <Avatar className="avatar-initial" style={{ background: d.color, margin: '0 auto 14px' }} size={56}>
                  {d.initials}
                </Avatar>
                <Title level={5} style={{ marginBottom: 2 }}>
                  {d.name}
                </Title>
                <Text style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>{d.title}</Text>
                <Tag color="#0d9488" style={{ marginBottom: 14 }}>
                  {d.specialty}
                </Tag>
                <div>
                  <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            size="large"
            icon={<TeamOutlined />}
            onClick={(e) => e.preventDefault()}
            href="#"
          >
            Xem tất cả bác sĩ
          </Button>
        </div>
      </div>

      {/* ---------- Đánh giá bệnh nhân ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Phản hồi"
          title="Bệnh nhân nói gì về chúng tôi"
          subtitle="Những chia sẻ từ bệnh nhân đã trải nghiệm dịch vụ đặt lịch khám trực tuyến."
        />
        <Row gutter={[20, 20]}>
          {testimonials.map((t) => (
            <Col xs={24} md={8} key={t.name}>
              <Card className="soft-card" style={{ height: '100%' }}>
                <Rate disabled defaultValue={5} style={{ fontSize: 14, marginBottom: 12 }} />
                <Paragraph className="testimonial-quote">&ldquo;{t.text}&rdquo;</Paragraph>
                <Space align="center" style={{ marginTop: 12 }}>
                  <Avatar className="avatar-initial" style={{ background: t.color }} size={40}>
                    {t.initials}
                  </Avatar>
                  <div>
                    <Text strong style={{ display: 'block' }}>
                      {t.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {t.role}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ---------- Bảng giá tham khảo ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Chi phí minh bạch"
          title="Bảng giá dịch vụ tham khảo"
          subtitle="Mức giá có thể thay đổi tùy theo chỉ định của bác sĩ, vui lòng liên hệ để được tư vấn chính xác."
        />
        <Card className="soft-card" styles={{ body: { padding: 0 } }}>
          <Table
            columns={priceColumns}
            dataSource={priceData}
            pagination={false}
            showHeader
            style={{ borderRadius: 16, overflow: 'hidden' }}
          />
        </Card>
        <Text type="secondary" style={{ fontSize: 13, marginTop: 10, display: 'block', textAlign: 'center' }}>
          <TagsOutlined style={{ marginRight: 6 }} />
          Bảng giá trên chỉ mang tính chất tham khảo.
        </Text>
      </div>

      {/* ---------- Tin tức sức khỏe ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Kiến thức y tế"
          title="Tin tức sức khỏe"
          subtitle="Cập nhật những thông tin hữu ích giúp bạn và gia đình chăm sóc sức khỏe tốt hơn."
        />
        <Row gutter={[20, 20]}>
          {news.map((n) => (
            <Col xs={24} md={8} key={n.title}>
              <Card className="soft-card feature-card" style={{ height: '100%' }}>
                <span className="news-tag">{n.tag}</span>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {n.title}
                </Title>
                <Paragraph style={{ color: '#64748b', marginBottom: 14 }}>{n.desc}</Paragraph>
                <a className="news-read-more" href="#" onClick={(e) => e.preventDefault()}>
                  Đọc thêm <RightOutlined style={{ fontSize: 11 }} />
                </a>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ---------- FAQ ---------- */}
      <div className="home-section">
        <SectionHeading
          eyebrow="Giải đáp"
          title="Câu hỏi thường gặp"
          subtitle="Một số thắc mắc phổ biến khi đặt lịch khám trực tuyến."
        />
        <Card className="soft-card" styles={{ body: { padding: '8px 8px' } }}>
          <Collapse
            ghost
            expandIconPosition="end"
            defaultActiveKey={['0']}
            items={faqs.map((f, idx) => ({
              key: String(idx),
              label: (
                <Space>
                  <QuestionCircleOutlined style={{ color: '#0d9488' }} />
                  <Text strong>{f.q}</Text>
                </Space>
              ),
              children: <Paragraph style={{ color: '#64748b', marginBottom: 0 }}>{f.a}</Paragraph>,
            }))}
          />
        </Card>
      </div>

      {/* ---------- CTA cuối trang ---------- */}
      {!isAuthenticated && (
        <div className="home-section cta-banner">
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            Sẵn sàng đặt lịch khám?
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 20, fontSize: 15 }}>
            Tạo tài khoản miễn phí chỉ mất chưa đến 1 phút — bắt đầu đặt lịch ngay hôm nay.
          </Paragraph>
          <Space size="middle" wrap style={{ justifyContent: 'center', display: 'flex' }}>
            <Link to="/register">
              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{ background: '#fff', color: '#0d9488', border: 'none', fontWeight: 600 }}
              >
                Đăng ký ngay
              </Button>
            </Link>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}
              >
                Hotline: (012) 345 6789
              </Button>
            </a>
          </Space>
        </div>
      )}

      {/* ---------- Liên hệ nhanh ---------- */}
      <div className="home-section" style={{ marginBottom: 16 }}>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={8}>
            <Card className="soft-card" style={{ textAlign: 'center' }}>
              <div className="icon-badge" style={{ background: BRAND_GRADIENT, margin: '0 auto 12px' }}>
                <EnvironmentOutlined />
              </div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                Địa chỉ
              </Text>
              <Text type="secondary">123 Đường ABC, Quận XYZ, TP. HCM</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="soft-card" style={{ textAlign: 'center' }}>
              <div className="icon-badge" style={{ background: BRAND_GRADIENT, margin: '0 auto 12px' }}>
                <PhoneOutlined />
              </div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                Hotline
              </Text>
              <Text type="secondary">(012) 345 6789 — 8:00 - 17:00</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="soft-card" style={{ textAlign: 'center' }}>
              <div className="icon-badge" style={{ background: BRAND_GRADIENT, margin: '0 auto 12px' }}>
                <MailOutlined />
              </div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                Email
              </Text>
              <Text type="secondary">lienhe@phongkhamdakhoa.vn</Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
