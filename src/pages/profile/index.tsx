import { View, Text } from '@tarojs/components';
import { APP_CONFIG } from '@/config';
import { useAuthStore } from '@/shared/hooks/useAuth';
import './index.scss';

export default function Profile() {
  const { isLoggedIn, openid } = useAuthStore();

  return (
    <View className='profile'>
      {/* 用户头像区 */}
      <View className='profile-header'>
        <View className='avatar'>👤</View>
        <Text className='nickname'>ShoreOS 用户</Text>
        <Text className='uid'>ID: {openid.slice(0, 8)}...</Text>
      </View>

      {/* 功能列表 */}
      <View className='profile-section'>
        <Text className='section-title'>数据管理</Text>
        <View className='profile-item'>
          <Text>📊 自由指数数据</Text>
          <Text className='arrow'>›</Text>
        </View>
        <View className='profile-item'>
          <Text>⚖️ 体重数据</Text>
          <Text className='arrow'>›</Text>
        </View>
        <View className='profile-item'>
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
