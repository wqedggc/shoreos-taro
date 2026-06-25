import { PropsWithChildren, useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAuthStore } from './shared/hooks/useAuth';
import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  const { login } = useAuthStore();

  useDidShow(() => {});
  useDidHide(() => {});

  useEffect(() => {
    login(); // 静默登录
  }, []);

  return children;
}

export default App;
