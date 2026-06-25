import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface Props {
  icon: string;
  name: string;
  description: string;
  route: string;
  preview?: string;  // 卡片上显示的数据预览
  disabled?: boolean;
}

export default function ModuleCard({ icon, name, description, route, preview, disabled }: Props) {
  const handleClick = () => {
    if (!disabled && route) {
      Taro.navigateTo({ url: route });
    }
  };

  return (
    <View className={`module-card ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
      <View className='mc-left'>
        <Text className='mc-icon'>{icon}</Text>
        <View className='mc-info'>
          <Text className='mc-name'>{name}</Text>
          <Text className='mc-desc'>{disabled ? '敬请期待' : description}</Text>
        </View>
      </View>
      {preview && <Text className='mc-preview'>{preview}</Text>}
    </View>
  );
}
