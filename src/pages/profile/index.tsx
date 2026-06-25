import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { APP_CONFIG } from '@/config';
import { useAuthStore } from '@/shared/hooks/useAuth';
import './index.scss';

export default function Profile() {
  const { isLoggedIn, openid } = useAuthStore();

  const handleDataTap = (label: string) => {
    Taro.showToast({ title: `${label}（开发中）`, icon: 'none' });
    // TODO: 跳转对应数据页
    // if (label === '自由指数数据') Taro.navigateTo({ url: '/modules/fire/pages/result/index' });
  };

  return (
    <View className='profile'>
      {/* 用户头像区 */}
      <View className='profile-header'>
        <View className='avatar'>👤</View>
        <Text className='nickname'>ShoreOS 用户</Text>
        <Text className='uid'>ID: {openid ? openid.slice(0, 8) + '...' : '未登录'}</Text>
      </View>

      {/* 功能列表 */}
      <View className='profile-section'>
        <Text className='section-title'>数据管理</Text>
        <View className='profile-item' onClick={() => handleDataTap('自由指数数据')}>
          <Text>📊 自由指数数据</Text>
          <Text className='arrow'>›</Text>
        </View>
        <View className='profile-item' onClick={() => handleDataTap('体重数据')}>
          <Text>⚖️ 体重数据</Text>
          <Text className='arrow'>›</Text>
        </View>
        <View className='profile-item' onClick={() => handleDataTap('导出数据')}>
          <Text>📤 导出数据</Text>
          <Text className='arrow'>›</Text>
        </View>
      </View>

      <View className='profile-section'>
        <Text className='section-title'>关于</Text>
        <View className='profile-item'>
          <Text>版本号</Text>
          <Text className='value'>v{APP_CONFIG.version}</Text>
        </View>
        <View className='profile-item'>
          <Text>登录状态</Text>
          <Text className='value'>{isLoggedIn ? '✅ 已登录' : '❌ 离线'}</Text>
        </View>
      </View>
    </View>
  );
}
