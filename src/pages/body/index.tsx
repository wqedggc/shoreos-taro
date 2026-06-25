import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import './index.scss';

export default function BodyPage() {
  const [weight, setWeight] = useState<number | null>(null);

  return (
    <View className='body-page'>
      {/* 最新数据指标 */}
      <View className='body-metrics'>
        <View className='body-metric'>
          <Text className='metric-value'>{weight || '--'}</Text>
          <Text className='metric-label'>体重 kg</Text>
        </View>
        <View className='body-metric'>
          <Text className='metric-value'>--</Text>
          <Text className='metric-label'>体脂率 %</Text>
        </View>
        <View className='body-metric'>
          <Text className='metric-value'>--</Text>
          <Text className='metric-label'>BMI</Text>
        </View>
      </View>

      {/* 目标进度 */}
      <View className='body-card'>
        <Text className='card-title'>🎯 目标体重 65kg</Text>
        <View className='progress-bar'>
          <View className='progress-fill' style={{ width: '0%' }} />
        </View>
        <Text className='progress-text'>暂无数据</Text>
      </View>

      {/* 操作按钮 */}
      <View className='body-actions'>
        <View className='action-btn primary' onClick={() => {}}>
          <Text>✏️ 记录数据</Text>
        </View>
        <View className='action-btn' onClick={() => {}}>
          <Text>📥 导入数据</Text>
        </View>
      </View>

      {/* 历史记录占位 */}
      <View className='body-card'>
        <Text className='card-title'>📋 历史记录</Text>
        <Text className='empty-text'>暂无数据，点击上方按钮开始记录</Text>
      </View>
    </View>
  );
}
