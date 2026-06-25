import { View, Text, Input, Picker } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { calculate, FireInputs } from '@/engine/fire';
import { get, set, STORE_KEYS } from '@/shared/services/dataStore';
import Step1Basic    from './steps/Step1Basic';
import Step2Social   from './steps/Step2Social';
import Step3Housing  from './steps/Step3Housing';
import Step4Expense  from './steps/Step4Expense';
import Step5Assets    from './steps/Step5Assets';
import './index.scss';

const currentYear = new Date().getFullYear();

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
  const [step, setStep]       = useState(1);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const [animKey, setAnimKey]   = useState(0); // 强制重绘触发动画
  const [inputs, setInputs]     = useState<FireInputs>(get(STORE_KEYS.fireInput) ?? defaultInputs);

  const update = (key: keyof FireInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (step >= 5) return;
    setSlideDir('left');
    setAnimKey(k => k + 1);
    setStep(s => s + 1);
  };

  const goPrev = () => {
    if (step <= 1) return;
    setSlideDir('right');
    setAnimKey(k => k + 1);
    setStep(s => s - 1);
  };

  const onCalc = () => {
    const result = calculate(inputs);
    if (!result) {
      Taro.showToast({ title: '请检查出生年份', icon: 'none' });
      return;
    }
    set(STORE_KEYS.fireInput, inputs);
    set(STORE_KEYS.fireResult, result);
    Taro.setStorageSync('shoreos_fire_result', result);
    Taro.navigateTo({ url: '/modules/fire/pages/result/index' });
  };

  const progressPct = `${(step / 5) * 100}%`;

  const renderStep = () => {
    const common = { inputs, update };
    switch (step) {
      case 1:  return <Step1Basic   key={animKey} slideDir={slideDir} {...common} />;
      case 2:  return <Step2Social  key={animKey} slideDir={slideDir} {...common} />;
      case 3:  return <Step3Housing key={animKey} slideDir={slideDir} {...common} />;
      case 4:  return <Step4Expense key={animKey} slideDir={slideDir} {...common} />;
      case 5:  return <Step5Assets  key={animKey} slideDir={slideDir} {...common} onCalc={onCalc} />;
      default: return null;
    }
  };

  const stepLabels = ['', '基本信息', '社保', '住房', '开销', '资产'];

  return (
    <View className='fire-calc'>
      {/* 顶部进度条 */}
      <View className='progress-track'>
        <View className='progress-fill' style={{ width: progressPct }} />
      </View>

      {/* 步骤指示器 */}
      <View className='step-indicator'>
        {stepLabels.slice(1).map((label, i) => (
          <View key={i} className={`step-dot-wrap ${i + 1 <= step ? 'done' : ''} ${i + 1 === step ? 'current' : ''}`}>
            <View className='step-dot'>{i + 1}</View>
            <Text className='step-dot-label'>{label}</Text>
          </View>
        ))}
      </View>

      {/* 步骤内容（带动画） */}
      <View className='step-body'>
        {renderStep()}
      </View>

      {/* 底部导航按钮 */}
      <View className='bottom-bar'>
        {step > 1 && (
          <View className='btn-secondary' onClick={goPrev}>
            <Text>← 上一步</Text>
          </View>
        )}
        {step < 5 ? (
          <View className='btn-primary' onClick={goNext}>
            <Text>下一步 →</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
