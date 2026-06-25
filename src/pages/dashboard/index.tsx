import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { MODULE_REGISTRY, APP_CONFIG } from '@/config';
import { useAuthStore } from '@/shared/hooks/useAuth';
import { list, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

interface BodyRecord { date: string; weight: number; fat: number; }
interface FinanceRecord { amount: number; type: 'expense' | 'income'; date: string; }

export default function Dashboard() {
  const { userInfo } = useAuthStore();
  const [records, setRecords] = useState<BodyRecord[]>(() => list<BodyRecord>(STORE_KEYS.body));
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => list<FinanceRecord>(STORE_KEYS.finance));
  const [fireResult, setFireResult] = useState<any>(() => {
    try { return list<any>('shoreos_fire_result')?.[0] || null; } catch { return null; }
  });

  useDidShow(() => {
    setRecords(list<BodyRecord>(STORE_KEYS.body));
    setFinanceRecords(list<FinanceRecord>(STORE_KEYS.finance));
    try {
      const fr = list<any>('shoreos_fire_result');
      setFireResult(fr?.[0] || null);
    } catch { setFireResult(null); }
  });

  const bodyLatest = records.length > 0 ? records[records.length - 1] : null;
  const bodyCount = records.length;

  // 记账本月统计
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthIncome = financeRecords.filter(r => r.date?.startsWith(monthStr) && r.type === 'income').reduce((s, r) => s + (r.amount || 0), 0);
  const monthExpense = financeRecords.filter(r => r.date?.startsWith(monthStr) && r.type === 'expense').reduce((s, r) => s + (r.amount || 0), 0);

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
                    : mod.id === 'finance'
                      ? `${monthExpense > 0 ? '支出 ' + monthExpense.toFixed(0) + '元' : '点击进入 →'}`
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
                {fireResult ? (
                  <>
                    <Text className='preview-big'>{fireResult.freedomIndex?.toFixed(0)}%</Text>
                    <Text className='preview-sub'>自由指数</Text>
                  </>
                ) : (
                  <>
                    <Text className='preview-big'>--</Text>
                    <Text className='preview-sub'>未计算</Text>
                  </>
                )}
              </View>
            )}
            {mod.id === 'finance' && (
              <View className='card-preview'>
                <Text className='preview-big' style={{ color: monthExpense > monthIncome ? '#ff3b30' : '#34c759' }}>
                  {(monthIncome - monthExpense).toFixed(0)}
                </Text>
                <Text className='preview-sub'>本月结余(元)</Text>
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
