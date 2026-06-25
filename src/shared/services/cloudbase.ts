import Taro from '@tarojs/taro';
import { APP_CONFIG } from '@/config';

// CloudBase 初始化（需在 app.tsx 中调用）
export function initCloudBase() {
  if (process.env.TARO_ENV === 'weapp' && APP_CONFIG.cloudbase.env) {
    Taro.cloud.init({ env: APP_CONFIG.cloudbase.env });
  }
}

// 通用 CRUD 封装
const db = () => Taro.cloud.database();

export async function getCollection(collection: string, query: any = {}) {
  try {
    const res = await db().collection(collection).where(query).get();
    return res.data;
  } catch (e) {
    console.error('CloudBase get error:', e);
    return [];
  }
}

export async function addDocument(collection: string, data: any) {
  try {
    const res = await db().collection(collection).add({ data });
    return res._id;
  } catch (e) {
    console.error('CloudBase add error:', e);
    return null;
  }
}

export async function updateDocument(collection: string, id: string, data: any) {
  try {
    await db().collection(collection).doc(id).update({ data });
    return true;
  } catch (e) {
    console.error('CloudBase update error:', e);
    return false;
  }
}

export async function deleteDocument(collection: string, id: string) {
  try {
    await db().collection(collection).doc(id).remove();
    return true;
  } catch (e) {
    console.error('CloudBase delete error:', e);
    return false;
  }
}
