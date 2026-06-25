import { View, Text, Input } from '@tarojs/components';
import { FireInputs } from '@/engine/fire';

interface Props {
  inputs: FireInputs;
  update: (key: keyof FireInputs, value: any) => void;
  onCalc: () => void;
}

const ASSETS = [
  { key: 'assetCash',     label: '现金' },
  { key: 'assetDeposit',  label: '存款' },
  { key: 'assetFund',     label: '基金' },
  { key: 'assetStock',    label: '股票' },
  { key: 'assetPension',  label: '养老金' },
] as const;

function totalAssets(inputs: FireInputs): number {
  return ASSETS.reduce((s, { key }) => s + ((inputs as any)[key] || 0), 0);
}

export default function Step5Assets({ inputs, update, onCalc }: Props) {
  const total = totalAssets(inputs);

  return (
    <View className='step-panel active'>
      <View className='step-header'>
        <Text className='step-title'>💰 我的资产</Text>
        <Text className='step-desc'>你的资产在退休时会继续增长</Text>
      </View>

      {/* 资产总览 */}
      <View className='asset-summary'>
        <Text className='asset-summary-label'>资产合计</Text>
        <Text className='asset-summary-value'>{total.toFixed(0)} 万</Text>
      </View>

      {/* 资产明细 */}
      <View className='form-group'>
        <Text className='group-title'>资产分布（万元）</Text>
        {ASSETS.map(({ key, label }) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input
              className='form-input'
              type='digit'
              value={String((inputs as any)[key])}
              onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)}
            />
            <Text className='form-unit'>万</Text>
          </View>
        ))}
      </View>

      {/* 年化收益 */}
      <View className='form-group'>
        <View className='form-row'>
          <Text className='form-label'>年化收益预期</Text>
          <Input
            className='form-input'
            type='digit'
            value={String(inputs.assetReturn)}
            onInput={(e) => update('assetReturn', parseFloat(e.detail.value) || 0)}
          />
          <Text className='form-unit'>%</Text>
        </View>
        <View className='range-hint'>
          <Text className='hint-text'>保守 2% — 稳健 6% — 激进 12%</Text>
        </View>
      </View>

      {/* 计算按钮（Step5 内） */}
      <View className='calc-btn' onClick={onCalc}>
        <Text>🚀 开始计算</Text>
      </View>

      <View className='step-tip'>
        <Text className='tip-text'>💡 年化收益越高，FIRE 目标越早达成</Text>
      </View>
    </View>
  );
}
