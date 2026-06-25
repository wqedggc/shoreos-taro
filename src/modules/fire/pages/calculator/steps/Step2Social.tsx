import { View, Text, Input, Picker } from '@tarojs/components';
import { FireInputs } from '@/engine/fire';

interface Props { inputs: FireInputs; update: (key: keyof FireInputs, value: any) => void; }

export default function Step2Social({ inputs, update }: Props) {
  return (
    <View className='step-panel active'>
      <View className='step-header'>
        <Text className='step-title'>🏥 我的社保</Text>
        <Text className='step-desc'>社保缴得越久，退休金越多</Text>
      </View>

      <View className='form-group'>
        <View className='form-row'>
          <Text className='form-label'>已缴养老</Text>
          <Input className='form-input' type='number' value={String(inputs.pensionYears)} onInput={(e) => update('pensionYears', parseInt(e.detail.value) || 0)} />
          <Text className='form-unit'>年</Text>
        </View>
        <View className='form-row'>
          <Text className='form-label'>已缴医疗</Text>
          <Input className='form-input' type='number' value={String(inputs.medicalYears)} onInput={(e) => update('medicalYears', parseInt(e.detail.value) || 0)} />
          <Text className='form-unit'>年</Text>
        </View>
        <View className='form-row'>
          <Text className='form-label'>养老月缴</Text>
          <Input className='form-input' type='digit' value={String(inputs.pensionSelfPay)} onInput={(e) => update('pensionSelfPay', parseFloat(e.detail.value) || 0)} />
          <Text className='form-unit'>元</Text>
        </View>
        <View className='form-row'>
          <Text className='form-label'>医疗月缴</Text>
          <Input className='form-input' type='digit' value={String(inputs.medicalSelfPay)} onInput={(e) => update('medicalSelfPay', parseFloat(e.detail.value) || 0)} />
          <Text className='form-unit'>元</Text>
        </View>
        <View className='form-row'>
          <Text className='form-label'>缴纳策略</Text>
          <Picker
            mode='selector'
            range={['缴满即停', '一直缴到退休']}
            value={inputs.ssStrategy === 'min' ? 0 : 1}
            onChange={(e) => update('ssStrategy', e.detail.value === 0 ? 'min' : 'retire')}
          >
            <View className='form-picker'>{inputs.ssStrategy === 'min' ? '缴满即停' : '一直缴到退休'}</View>
          </Picker>
        </View>
      </View>

      <View className='step-tip'>
        <Text className='tip-text'>💡 缴满即停 = 达到最低年限就停缴，退休后领取基础养老金</Text>
      </View>
    </View>
  );
}
