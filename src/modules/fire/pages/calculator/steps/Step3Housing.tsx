import { View, Text, Input, Picker } from '@tarojs/components';
import { FireInputs } from '@/engine/fire';

interface Props { inputs: FireInputs; update: (key: keyof FireInputs, value: any) => void; }

const OPTIONS = [
  { key: 'rent',      label: '🏢 租房', desc: '每月付租金' },
  { key: 'mortgage',  label: '🏠 房贷', desc: '每月还月供' },
  { key: 'none',      label: '✕ 无',   desc: '无住房支出' },
] as const;

export default function Step3Housing({ inputs, update }: Props) {
  return (
    <View className='step-panel active'>
      <View className='step-header'>
        <Text className='step-title'>🏠 我的住房</Text>
        <Text className='step-desc'>选一个最符合你情况的</Text>
      </View>

      {/* 卡片选择 */}
      <View className='house-cards'>
        {OPTIONS.map(opt => (
          <View
            key={opt.key}
            className={`house-card ${inputs.houseType === opt.key ? 'active' : ''}`}
            onClick={() => update('houseType', opt.key)}
          >
            <Text className='house-card-label'>{opt.label}</Text>
            <Text className='house-card-desc'>{opt.desc}</Text>
          </View>
        ))}
      </View>

      {/* 动态展开字段 — 带折叠动画 */}
      <View className={`collapse-wrap ${inputs.houseType === 'rent' ? 'open' : ''}`}>
        {inputs.houseType === 'rent' && (
          <View className='form-group collapse-inner'>
            <View className='form-row'>
              <Text className='form-label'>月租金</Text>
              <Input className='form-input' type='digit' value={String(inputs.expRent)} onInput={(e) => update('expRent', parseFloat(e.detail.value) || 0)} />
              <Text className='form-unit'>元</Text>
            </View>
          </View>
        )}
      </View>

      <View className={`collapse-wrap ${inputs.houseType === 'mortgage' ? 'open' : ''}`}>
        {inputs.houseType === 'mortgage' && (
          <View className='form-group collapse-inner'>
            <View className='form-row'>
              <Text className='form-label'>月供</Text>
              <Input className='form-input' type='digit' value={String(inputs.expMortgage)} onInput={(e) => update('expMortgage', parseFloat(e.detail.value) || 0)} />
              <Text className='form-unit'>元</Text>
            </View>
            <View className='form-row'>
              <Text className='form-label'>剩余年限</Text>
              <Input className='form-input' type='number' value={String(inputs.mortgageYearsLeft)} onInput={(e) => update('mortgageYearsLeft', parseInt(e.detail.value) || 0)} />
              <Text className='form-unit'>年</Text>
            </View>
          </View>
        )}
      </View>

      <View className='step-tip'>
        <Text className='tip-text'>💡 退休后住房支出可能变化，可在「退休后开销」里单独调整</Text>
      </View>
    </View>
  );
}
