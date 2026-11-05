import type { ThemeConfig } from 'antd';

export const FONT_STACK =
  "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const BRAND_GRADIENT = 'linear-gradient(135deg, #0d9488 0%, #0ea5a4 100%)';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#0d9488',
    colorInfo: '#0d9488',
    colorLink: '#0d9488',
    colorLinkHover: '#0f766e',
    borderRadius: 10,
    fontFamily: FONT_STACK,
    colorBgLayout: '#f3f6fb',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f3f6fb',
      footerBg: 'transparent',
      siderBg: '#0f172a',
    },
    Menu: {
      darkItemBg: '#0f172a',
      darkItemColor: 'rgba(255,255,255,0.75)',
      darkItemSelectedBg: '#0d9488',
      darkItemHoverBg: 'rgba(13,148,136,0.18)',
      itemSelectedBg: 'rgba(13,148,136,0.1)',
      itemSelectedColor: '#0d9488',
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 24,
    },
    Button: {
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 500,
    },
    Table: {
      headerBg: '#f8fafc',
      borderRadius: 10,
    },
    Statistic: {
      titleFontSize: 14,
    },
  },
};
