import { View, Text, Input } from '@tarojs/components';
import { FireInputs } from '@/engine/fire';

interface Props { inputs: FireInputs; update: (key: keyof FireInputs, value: any) => void; }

const CURRENT_EXP = [
  { key: 'expFood',      label: '饮食' },
  { key: 'expTransport', label: '交通' },
  { key: 'expEntertain', label: '娱乐' },
  { key: 'expInsurance', label: '保险' },
  { key: 'expOther',     label: '其他' },
] as const;

const RETIRED_EXP = [
  { key: 'expQHousing',  label: '住房' },
  { key: 'expQFood',      label: '饮食' },
  { key: 'expQTransport', label: '交通' },
  { key: 'expQEntertain', label: '娱乐' },
  { key: 'expQInsurance', label: '保险' },
  { key: 'expQOther',     label: '其他' },
] as const;

function totalExpense(inputs: FireInputs, keys: readonly { key: string }[]): number {
  return keys.reduce((sum, { key }) => sum + ((inputs as any)[key] || 0), 0);
}

export default function Step4Expense({ inputs, update }: Props) {
  const curTotal  = totalExpense(inputs, CURRENT_EXP);
  const retTotal  = totalExpense(inputs, RETIRED_EXP);

  return (
    <View className='step-panel active'>
      <View className='step-header'>
        <Text className='step-title'>💸 我的开销</Text>
        <Text className='step-desc'>当前和退休后的月度支出</Text>
      </View>

      {/* 当前月开销 */}
      <View className='form-group'>
        <View className='group-title-row'>
          <Text className='group-title'>当前月开销</Text>
          <Text className='group-total'>{curTotal.toFixed(0)} 元/月</Text>
        </View>
        {CURRENT_EXP.map(({ key, label }) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input
              className='form-input'
              type='digit'
              value={String((inputs as any)[key])}
              onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)}
            />
            <Text className='form-unit'>元</Text>
          </View>
        ))}
      </View>

      {/* 退休后月开销 */}
      <View className='form-group'>
        <View className='group-title-row'>
          <Text className='group-title'>退休后月开销</Text>
          <Text className='group-total'>{retTotal.toFixed(0)} 元/月</Text>
        </View>
        {RETIRED_EXP.map(({ key, label }) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input
              className='form-input'
              type='digit'
              value={String((inputs as any)[key])}
              onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)}
            />
            <Text className='form-unit'>元</Text>
          </View>
        ))}
      </View>

      <View className='step-tip'>
        <Text className='tip-text'>💡 退休后开销通常会降低，也可单独调整每一项</Text>
      </View>
    </View>
  );
}
