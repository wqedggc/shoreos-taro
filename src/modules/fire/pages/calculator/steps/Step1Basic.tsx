import { View, Text, Input, Picker } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { FireInputs } from '@/engine/fire';

interface Props { inputs: FireInputs; update: (key: keyof FireInputs, value: any) => void; }

export default function Step1Basic({ inputs, update }: Props) {
  return (
    <View className='step-panel active'>
      <View className='step-header'>
        <Text className='step-title'>👤 我是谁</Text>
        <Text className='step-desc'>先告诉我们关于你的基本信息</Text>
      </View>

      <View className='form-group'>
        <View className='form-row'>
          <Text className='form-label'>出生年份</Text>
          <Input
            className='form-input'
            type='number'
            value={String(inputs.birthYear)}
            onInput={(e) => update('birthYear', parseInt(e.detail.value) || 1990)}
          />
        </View>
        <View className='form-row'>
          <Text className='form-label'>税后年收入</Text>
          <Input
            className='form-input'
            type='digit'
            value={String(inputs.incomePost)}
            onInput={(e) => update('incomePost', parseFloat(e.detail.value) || 0)}
          />
          <Text className='form-unit'>万</Text>
        </View>
      </View>

      <View className='step-tip'>
        <Text className='tip-text'>💡 年收入用于计算你的储蓄率和 FIRE 目标</Text>
      </View>
    </View>
  );
}
