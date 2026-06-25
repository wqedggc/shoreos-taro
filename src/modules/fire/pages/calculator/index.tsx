import { View, Text, Input, Picker } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { calculate, FireInputs } from '@/engine/fire';
import { get, set, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

const currentYear = new Date().getFullYear();

// 默认输入（首次进入或无历史时用）
const defaultInputs: FireInputs = {
  birthYear: 1990,
  currentYear,
  pensionYears: 5, medicalYears: 5,
  pensionMin: 15, medicalMin: 25,
  pensionSelfPay: 800, medicalSelfPay: 400,
  ssStrategy: 'min',
  incomePost: 20,
  houseType: 'rent',
  expRent: 3000, expMortgage: 0, mortgageYearsLeft: 0, expProperty: 0,
  expFood: 2000, expTransport: 500, expPet: 0, expEntertain: 800, expInsurance: 500, expOther: 1000,
  expQFood: 1500, expQTransport: 300, expQPet: 0, expQEntertain: 400, expQInsurance: 500, expQOther: 800, expQHousing: 1500,
  assetCash: 10, assetDeposit: 20, assetFund: 10, assetStock: 10, assetPension: 5, assetReturn: 2,
  childPlan: 'none', childCost: 0,
};

export default function FireCalculatorPage() {
  const [inputs, setInputs] = useState<FireInputs>(
    get<FireInputs>(STORE_KEYS.fireInput) ?? defaultInputs
  );

  const update = (key: keyof FireInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const onCalc = () => {
    const result = calculate(inputs);
    if (!result) {
      Taro.showToast({ title: '请检查出生年份', icon: 'none' });
      return;
    }
    // 存输入 + 结果，跳结果页
    set(STORE_KEYS.fireInput, inputs);
    Taro.setStorageSync('shoreos_fire_result', result);
    Taro.navigateTo({ url: '/modules/fire/pages/result/index' });
  };

  return (
    <View className='fire-calc'>
      {/* 基本信息 */}
      <View className='form-group'>
        <Text className='group-title'>基本信息</Text>
        <View className='form-row'>
          <Text className='form-label'>出生年份</Text>
          <Input className='form-input' type='number' value={String(inputs.birthYear)} onInput={(e) => update('birthYear', parseInt(e.detail.value) || 0)} />
        </View>
        <View className='form-row'>
          <Text className='form-label'>税后年收入</Text>
          <Input className='form-input' type='digit' value={String(inputs.incomePost)} onInput={(e) => update('incomePost', parseFloat(e.detail.value) || 0)} />
          <Text className='form-unit'>万</Text>
        </View>
      </View>

      {/* 社保 */}
      <View className='form-group'>
        <Text className='group-title'>社保</Text>
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
          <Picker mode='selector' range={['缴满即停', '一直缴到退休']} value={inputs.ssStrategy === 'min' ? 0 : 1} onChange={(e) => update('ssStrategy', e.detail.value === 0 ? 'min' : 'retire')}>
            <View className='form-picker'>{inputs.ssStrategy === 'min' ? '缴满即停' : '一直缴到退休'}</View>
          </Picker>
        </View>
      </View>

      {/* 住房 */}
      <View className='form-group'>
        <Text className='group-title'>住房</Text>
        <View className='form-row'>
          <Text className='form-label'>住房类型</Text>
          <Picker mode='selector' range={['租房', '房贷', '无']} value={inputs.houseType === 'rent' ? 0 : inputs.houseType === 'mortgage' ? 1 : 2} onChange={(e) => update('houseType', e.detail.value === 0 ? 'rent' : e.detail.value === 1 ? 'mortgage' : 'none')}>
            <View className='form-picker'>{inputs.houseType === 'rent' ? '租房' : inputs.houseType === 'mortgage' ? '房贷' : '无'}</View>
          </Picker>
        </View>
        {inputs.houseType === 'rent' && (
          <View className='form-row'>
            <Text className='form-label'>月租金</Text>
            <Input className='form-input' type='digit' value={String(inputs.expRent)} onInput={(e) => update('expRent', parseFloat(e.detail.value) || 0)} />
            <Text className='form-unit'>元</Text>
          </View>
        )}
        {inputs.houseType === 'mortgage' && (
          <>
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
          </>
        )}
      </View>

      {/* 当前开销 */}
      <View className='form-group'>
        <Text className='group-title'>当前月开销</Text>
        {[
          ['expFood', '饮食'], ['expTransport', '交通'], ['expEntertain', '娱乐'],
          ['expInsurance', '保险'], ['expOther', '其他'],
        ].map(([key, label]) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input className='form-input' type='digit' value={String(inputs[key])} onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)} />
            <Text className='form-unit'>元</Text>
          </View>
        ))}
      </View>

      {/* 退休后开销 */}
      <View className='form-group'>
        <Text className='group-title'>退休后月开销</Text>
        {[
          ['expQHousing', '住房'], ['expQFood', '饮食'], ['expQTransport', '交通'],
          ['expQEntertain', '娱乐'], ['expQInsurance', '保险'], ['expQOther', '其他'],
        ].map(([key, label]) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input className='form-input' type='digit' value={String(inputs[key])} onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)} />
            <Text className='form-unit'>元</Text>
          </View>
        ))}
      </View>

      {/* 资产 */}
      <View className='form-group'>
        <Text className='group-title'>资产（万元）</Text>
        {[
          ['assetCash', '现金'], ['assetDeposit', '存款'], ['assetFund', '基金'],
          ['assetStock', '股票'], ['assetPension', '养老金'],
        ].map(([key, label]) => (
          <View className='form-row' key={key}>
            <Text className='form-label'>{label}</Text>
            <Input className='form-input' type='digit' value={String(inputs[key])} onInput={(e) => update(key as keyof FireInputs, parseFloat(e.detail.value) || 0)} />
            <Text className='form-unit'>万</Text>
          </View>
        ))}
        <View className='form-row'>
          <Text className='form-label'>年化收益</Text>
          <Input className='form-input' type='digit' value={String(inputs.assetReturn)} onInput={(e) => update('assetReturn', parseFloat(e.detail.value) || 0)} />
          <Text className='form-unit'>%</Text>
        </View>
      </View>

      <View className='calc-btn' onClick={onCalc}>
        <Text>开始计算</Text>
      </View>
    </View>
  );
}
