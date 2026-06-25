import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { APP_CONFIG } from '@/config';

interface AuthState {
  isLoggedIn: boolean;
  openid: string;
  userInfo: any;
  login: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  openid: '',
  userInfo: null,

  login: async () => {
    try {
      // 微信小程序环境：wx.login 获取 code → CloudBase 换取 openid
      if (process.env.TARO_ENV === 'weapp') {
        const { code } = await Taro.login();
        // TODO: 调用云函数换取 openid (配置 CloudBase 后启用)
        // const res = await Taro.cloud.callFunction({ name: 'login', data: { code } });
        set({ isLoggedIn: true, openid: code /* 临时用 code 占位 */ });
      } else {
        // H5 环境：使用本地模拟登录
        const mockId = 'h5_' + Date.now();
        set({ isLoggedIn: true, openid: mockId });
      }
      
      // 静默迁移本地数据
      await migrateLocalData();
    } catch (e) {
      console.error('登录失败', e);
      // 降级：仍标记为已登录，允许离线使用
      set({ isLoggedIn: true, openid: 'offline' });
    }
  },
}));

// 静默迁移 localStorage 数据到云存储
async function migrateLocalData() {
  try {
    const saved = Taro.getStorageSync('shoreos_data');
    if (saved) {
      // TODO: 上传到 CloudBase
      // await Taro.cloud.callFunction({ name: 'migrate', data: JSON.parse(saved) });
      console.log('数据迁移待实现');
    }
  } catch (e) {
    // 静默失败
  }
}
