import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { MODULE_REGISTRY, APP_CONFIG } from '@/config';
import { useAuthStore } from '@/shared/hooks/useAuth';
import { list, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

interface BodyRecord { date: string; weight: number; fat: number; }

export default function Dashboard() {
  const { userInfo } = useAuthStore();
  const [records, setRecords] = useState<BodyRecord[]>(() => list<BodyRecord>(STORE_KEYS.body));

  useDidShow(() => {
    setRecords(list<BodyRecord>(STORE_KEYS.body));
  });

  const bodyLatest = records.length > 0 ? records[records.length - 1] : null;
  const bodyCount = records.length;

  const onCardTap = (mod) => {
    if (mod.route) Taro.navigateTo({ url: mod.route });
  };

  return (
    <View className='dashboard'>
      <View className='dash-header'>
        <Text className='dash-greeting'>你好，{userInfo?.nickName || 'Shore'}</Text>
        <Text className='dash-version'>v{APP_CONFIG.version}</Text>
      </View>

      <ScrollView className='dash-cards' scrollY>
        {MODULE_REGISTRY.filter(m => m.enabled).map(mod => (
          <View key={mod.id} className='dash-card' onClick={() => onCardTap(mod)}>
            <View className='card-left'>
              <Text className='card-icon'>{mod.icon}</Text>
              <View className='card-info'>
                <Text className='card-name'>{mod.name}</Text>
                <Text className='card-desc'>
                  {mod.id === 'body' && bodyCount > 0
                    ? `${bodyCount} 条记录`
                    : '点击进入 →'}
                </Text>
              </View>
            </View>
            {mod.id === 'body' && bodyLatest && (
              <View className='card-preview'>
                <Text className='preview-big'>{bodyLatest.weight}kg</Text>
                <Text className='preview-sub'>最新</Text>
              </View>
            )}
            {mod.id === 'fire' && (
              <View className='card-preview'>
                <Text className='preview-big'>--</Text>
                <Text className='preview-sub'>未计算</Text>
              </View>
            )}
          </View>
        ))}

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
