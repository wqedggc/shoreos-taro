import Taro from '@tarojs/taro';

/**
 * 本地存储实现 — 基于 Taro.getStorageSync / setStorageSync
 * 双端兼容：小程序走 wx storage，H5 走 localStorage，Taro 已抹平。
 */

export function list<T>(key: string): T[] {
  try {
    const data = Taro.getStorageSync(key);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** 整批覆盖写 */
export function save<T>(key: string, items: T[]): void {
  try {
    Taro.setStorageSync(key, items);
  } catch (e) {
    console.error('local.save error:', e);
  }
}

/** 按指定字段去重合并（存在则覆盖，不存在则追加），并按该字段排序 */
export function upsert<T>(key: string, item: T, matchKey: keyof T): T[] {
  const items = list<T>(key);
  const idx = items.findIndex(it => it[matchKey] === item[matchKey]);
  if (idx >= 0) items[idx] = item;
  else items.push(item);
  // 按 matchKey 升序
  items.sort((a, b) => {
    const av = a[matchKey] as any;
    const bv = b[matchKey] as any;
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  save(key, items);
  return items;
}

/** 单对象读取 */
export function get<T>(key: string): T | null {
  try {
    const data = Taro.getStorageSync(key);
    return data ?? null;
  } catch {
    return null;
  }
}

/** 单对象写入 */
export function set<T>(key: string, item: T): void {
  try {
    Taro.setStorageSync(key, item);
  } catch (e) {
    console.error('local.set error:', e);
  }
}

export function remove(key: string): void {
  try {
    Taro.removeStorageSync(key);
  } catch (e) {
    console.error('local.remove error:', e);
  }
}
