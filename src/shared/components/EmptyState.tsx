import { View, Text } from '@tarojs/components';

interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = '📭', title, description, actionText, onAction }: Props) {
  return (
    <View className='empty-state'>
      <Text className='es-icon'>{icon}</Text>
      <Text className='es-title'>{title}</Text>
      {description && <Text className='es-desc'>{description}</Text>}
      {actionText && (
        <View className='es-action' onClick={onAction}>
          <Text>{actionText}</Text>
        </View>
      )}
    </View>
  );
}
