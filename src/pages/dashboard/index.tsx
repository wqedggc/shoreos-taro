import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { MODULE_REGISTRY, APP_CONFIG } from '@/config';
import { useAuthStore } from '@/shared/hooks/useAuth';
import './index.scss';

export default function Dashboard() {
  const { isLoggedIn, userInfo } = useAuthStore();
  const [greeting] = useState('你好');

  useDidShow(() => {
    // 每次回到首页刷新卡片数据
  });

  return (
    <View className='dashboard'>
      {/* 头部 */}
      <View className='dash-header'>
        <Text className='dash-greeting'>{greeting}，{userInfo?.nickName || '用户'}</Text>
        <Text className='dash-version'>v{APP_CONFIG.version}</Text>
      </View>

      {/* 功能卡片列表 */}
      <ScrollView className='dash-cards' scrollY>
        {MODULE_REGISTRY.filter(m => m.enabled).map(mod => (
          <View key={mod.id} className='dash-card' onClick={() => {
            // Taro.navigateTo({ url: mod.route })
          }}>
            <View className='card-left'>
              <Text className='card-icon'>{mod.icon}</Text>
              <View className='card-info'>
                <Text className='card-name'>{mod.name}</Text>
                <Text className='card-desc'>点击进入 →</Text>
              </View>
            </View>
          </View>
        ))}
        
        {/* 预留扩展槽位 */}
        {MODULE_REGISTRY.filter(m => !m.enabled).length > 0 && (
          <View className='dash-section-title'>
            <Text>即将上线</Text>
          </View>
        )}
        {MODULE_REGISTRY.filter(m => !m.enabled).map(mod => (
          <View key={mod.id} className='dash-card disabled'>
            <View className='card-left'>
              <Text className='card-icon'>{mod.icon}</Text>
              <View className='card-info'>
                <Text className='card-name'>{mod.name}</Text>
                <Text className='card-desc'>敬请期待</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
