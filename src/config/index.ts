export const APP_CONFIG = {
  appId: 'wx567cd9ea054b7225',  // 微信小程序 AppID
  appName: 'ShoreOS',
  version: '2.0.0',

  // CloudBase 配置
  cloudbase: {
    env: 'shoreos-d3gvi1l8qa5c37ff3',  // CloudBase 环境 ID
    collections: {
      users: 'users',
      fireData: 'fire_data',
      bodyMetrics: 'body_metrics',
    }
  },

  // 社保默认值
  defaults: {
    pensionMin: 15,
    medicalMin: 25,
    assetReturn: 2,
  },
};

// 模块注册表 — 新模块只需在这里加一条
export interface ModuleManifest {
  id: string;
  name: string;
  icon: string;
  cardComponent: string;  // 首页卡片的组件路径
  route: string;          // 模块主页路由
  enabled: boolean;
}

export const MODULE_REGISTRY: ModuleManifest[] = [
  {
    id: 'fire',
    name: '自由指数',
    icon: '🔥',
    cardComponent: 'FireCard',
    route: '/modules/fire/pages/calculator/index',
    enabled: true,
  },
  {
    id: 'body',
    name: '体重管理',
    icon: '⚖️',
    cardComponent: 'BodyCard',
    route: '/pages/body/index',
    enabled: true,
  },
  // 预留扩展槽位
  {
    id: 'finance',
    name: '记账',
    icon: '💳',
    cardComponent: '',
    route: '',
    enabled: false,
  },
  {
    id: 'sleep',
    name: '睡眠',
    icon: '😴',
    cardComponent: '',
    route: '',
    enabled: false,
  },
];
