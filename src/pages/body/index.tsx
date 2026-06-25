import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { list, get, set, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

interface BodyRecord {
  date: string;
  weight: number;
  fat: number;
}

const HEIGHT = 1.75; // 暂硬编码，后续可配

export default function BodyPage() {
  const [records, setRecords] = useState<BodyRecord[]>(() => list<BodyRecord>(STORE_KEYS.body));
  const [target, setTarget] = useState<number>(() => {
    const t = get<number>(STORE_KEYS.targetWeight);
    if (t === null) { set(STORE_KEYS.targetWeight, 65); return 65; }
    return t;
  });

  useDidShow(() => {
    setRecords(list<BodyRecord>(STORE_KEYS.body));
    setTarget(get<number>(STORE_KEYS.targetWeight) ?? 65);
  });

  const latest = records.length > 0 ? records[records.length - 1] : null;
  const bmi = latest ? (latest.weight / (HEIGHT * HEIGHT)).toFixed(1) : '--';

  // 目标进度
  let progress = 0;
  let progressText = '暂无数据，开始记录吧';
  if (latest && records.length > 0) {
    const startWeight = records[0].weight;
    const totalLoss = Math.max(startWeight - target, 0.1);
    progress = Math.min(((startWeight - latest.weight) / totalLoss) * 100, 100);
    progressText = latest.weight <= target
      ? '🎉 已达成目标！'
      : `还差 ${(latest.weight - target).toFixed(1)}kg · 进度 ${progress.toFixed(0)}%`;
  }

  // 趋势柱图数据（最多取最近 15 条）
  const chartData = records.slice(-15);
  const minW = chartData.length > 0 ? Math.min(...chartData.map(r => r.weight)) : 0;
  const maxW = chartData.length > 0 ? Math.max(...chartData.map(r => r.weight)) : 1;
  const range = maxW - minW || 1;

  const goRecord = () => Taro.navigateTo({ url: '/modules/body/pages/record/index' });
  const goImport = () => Taro.navigateTo({ url: '/modules/body/pages/import/index' });

  return (
    <View className='body-page'>
      {/* 最新数据指标 */}
      <View className='body-metrics'>
        <View className='body-metric'>
          <Text className='metric-value'>{latest ? latest.weight : '--'}</Text>
          <Text className='metric-label'>体重 kg</Text>
        </View>
        <View className='body-metric'>
          <Text className='metric-value'>{latest && latest.fat ? latest.fat : '--'}</Text>
          <Text className='metric-label'>体脂率 %</Text>
        </View>
        <View className='body-metric'>
          <Text className='metric-value'>{bmi}</Text>
          <Text className='metric-label'>BMI</Text>
        </View>
      </View>

      {/* 目标进度 */}
      <View className='body-card'>
        <Text className='card-title'>🎯 目标体重 {target}kg</Text>
        <View className='progress-bar'>
          <View className='progress-fill' style={{ width: `${Math.max(progress, 0)}%` }} />
        </View>
        <Text className='progress-text'>{progressText}</Text>
      </View>

      {/* 操作按钮 */}
      <View className='body-actions'>
        <View className='action-btn primary' onClick={goRecord}>
          <Text>✏️ 记录数据</Text>
        </View>
        <View className='action-btn' onClick={goImport}>
          <Text>📥 导入数据</Text>
        </View>
      </View>

      {/* 趋势柱图 */}
      <View className='body-card'>
        <Text className='card-title'>📈 体重趋势</Text>
        {chartData.length > 0 ? (
          <View className='chart-box'>
            {chartData.map((r, i) => (
              <View
                key={i}
                className='chart-bar'
                style={{ height: `${30 + (r.weight - minW) / range * 80}px` }}
              />
            ))}
          </View>
        ) : (
          <Text className='empty-text'>暂无数据</Text>
        )}
      </View>

      {/* 历史记录 */}
      <View className='body-card'>
        <Text className='card-title'>📋 最近记录</Text>
        {records.length > 0 ? (
          <View className='history-list'>
            {records.slice(-7).reverse().map((r, i) => (
              <View key={i} className='history-item'>
                <Text className='history-date'>{r.date}</Text>
                <Text className='history-weight'>{r.weight}kg</Text>
                <Text className='history-fat'>{r.fat ? r.fat + '%' : '--'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className='empty-text'>暂无数据，点击上方按钮开始记录</Text>
        )}
      </View>
    </View>
  );
}
