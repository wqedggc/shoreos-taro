import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { FireResult } from '@/engine/fire';
import './index.scss';

export default function FireResultPage() {
  const [result] = useState<FireResult | null>(() => {
    try {
      const r = Taro.getStorageSync('shoreos_fire_result');
      return r || null;
    } catch {
      return null;
    }
  });

  if (!result) {
    return (
      <View className='fire-result'>
        <View className='empty'>
          <Text>暂无结果，请先计算</Text>
          <View className='goto-calc' onClick={() => Taro.navigateBack()}>
            <Text>去计算</Text>
          </View>
        </View>
      </View>
    );
  }

  // 自由指数颜色
  const fiColor = result.freedomIndex >= 100 ? '#34c759' : result.freedomIndex >= 50 ? '#ff9500' : '#ff3b30';

  // 情景推演列表
  const scenarios = result.scenarios;

  // 资产预测柱图（取 continueWork，每 3 年取一个点避免太密）
  const proj = result.projections;
  const barLabels: string[] = [], barData: number[] = [];
  for (let i = 0; i < proj.labels.length; i += 3) {
    barLabels.push(proj.labels[i]);
    barData.push(proj.continueWork[i]);
  }
  const maxBar = Math.max(...barData, 1);

  return (
    <View className='fire-result'>
      {/* 自由指数大卡 */}
      <View className='hero-card'>
        <Text className='hero-label'>自由指数</Text>
        <Text className='hero-value' style={{ color: fiColor }}>{result.freedomIndex.toFixed(0)}%</Text>
        <Text className='hero-sub'>
          {result.freedomIndex >= 100 ? '🎉 已达成财务自由！' : `距 FIRE 还差 ${result.gap.toFixed(0)} 万`}
        </Text>
      </View>

      {/* 关键指标 */}
      <View className='metric-grid'>
        <View className='metric-cell'>
          <Text className='cell-value'>{result.fireTarget.toFixed(0)}</Text>
          <Text className='cell-label'>FIRE 目标(万)</Text>
        </View>
        <View className='metric-cell'>
          <Text className='cell-value'>{(result.totalAssets / 10000).toFixed(0)}</Text>
          <Text className='cell-label'>总资产(万)</Text>
        </View>
        <View className='metric-cell'>
          <Text className='cell-value'>{result.gap.toFixed(0)}</Text>
          <Text className='cell-label'>缺口(万)</Text>
        </View>
        <View className='metric-cell'>
          <Text className='cell-value'>{result.yearsToFire >= 999 ? '∞' : result.yearsToFire.toFixed(1)}</Text>
          <Text className='cell-label'>达成年数</Text>
        </View>
      </View>

      {/* 月开销对比 */}
      <View className='info-card'>
        <Text className='card-title'>💰 月度开销</Text>
        <View className='info-row'>
          <Text className='info-label'>当前月开销</Text>
          <Text className='info-value'>{result.monthlyExpense.toFixed(0)} 元</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>退休最低月开销</Text>
          <Text className='info-value'>{result.minMonthlyExpense.toFixed(0)} 元</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>年储蓄</Text>
          <Text className='info-value'>{(result.annualSavings / 10000).toFixed(1)} 万</Text>
        </View>
      </View>

      {/* 情景推演 */}
      <View className='info-card'>
        <Text className='card-title'>📊 情景推演</Text>
        {scenarios.map((s, i) => (
          <View key={i} className='scenario-row'>
            <View className='scenario-left'>
              <Text className='scenario-label'>{s.label}</Text>
              <Text className='scenario-age'>{s.age}岁 · 存活 {s.survival >= 999 ? '∞' : s.survival.toFixed(0)} 年</Text>
            </View>
            <View className='scenario-right'>
              <Text className='scenario-assets'>{s.assets.toFixed(0)} 万</Text>
              {s.isFree && <Text className='scenario-free'>✓ 自由</Text>}
            </View>
          </View>
        ))}
      </View>

      {/* 资产预测柱图 */}
      <View className='info-card'>
        <Text className='card-title'>📈 资产预测（持续工作）</Text>
        <View className='proj-chart'>
          {barData.map((v, i) => (
            <View key={i} className='proj-col'>
              <View className='proj-bar' style={{ height: `${(v / maxBar) * 100}%` }} />
              <Text className='proj-label'>{barLabels[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='recalc-btn' onClick={() => Taro.navigateBack()}>
        <Text>重新计算</Text>
      </View>
    </View>
  );
}
