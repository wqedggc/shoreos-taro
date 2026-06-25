import { View, Text, Input, Picker } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { upsert, get, set, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

interface BodyRecord {
  date: string;
  weight: number;
  fat: number;
}

export default function RecordPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState('');
  const [fat, setFat] = useState('');

  const onDateChange = (e) => setDate(e.detail.value);

  const onSave = () => {
    const w = parseFloat(weight);
    if (!date || isNaN(w)) {
      Taro.showToast({ title: '请填写日期和体重', icon: 'none' });
      return;
    }
    const record: BodyRecord = {
      date,
      weight: parseFloat(w.toFixed(1)),
      fat: parseFloat((parseFloat(fat) || 0).toFixed(1)),
    };
    upsert<BodyRecord>(STORE_KEYS.body, record, 'date');
    Taro.showToast({ title: '已保存', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 800);
  };

  const targetWeight = get<number>(STORE_KEYS.targetWeight);
  if (targetWeight === null) set(STORE_KEYS.targetWeight, 65);

  return (
    <View className='record-page'>
      <View className='form-card'>
        <View className='form-row'>
          <Text className='form-label'>日期</Text>
          <Picker mode='date' value={date} onChange={onDateChange}>
            <View className='form-picker'>{date}</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>体重</Text>
          <Input
            className='form-input'
            type='digit'
            placeholder='68.5'
            value={weight}
            onInput={(e) => setWeight(e.detail.value)}
          />
          <Text className='form-unit'>kg</Text>
        </View>
        <View className='form-row'>
          <Text className='form-label'>体脂率</Text>
          <Input
            className='form-input'
            type='digit'
            placeholder='22.1'
            value={fat}
            onInput={(e) => setFat(e.detail.value)}
          />
          <Text className='form-unit'>%</Text>
        </View>
      </View>

      <View className='form-actions'>
        <View className='btn-secondary' onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className='btn-primary' onClick={onSave}>
          <Text>保存</Text>
        </View>
      </View>
    </View>
  );
}
