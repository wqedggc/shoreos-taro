/**
 * CloudBase 数据存储实现（预留）
 *
 * 当前为 localStorage 透传实现，
 * 第二阶段接入 CloudBase 小程序 SDK 后替换为真实云端读写。
 *
 * 接口与 local.ts 保持一致，dataStore.ts 可通过开关切换。
 */
import Taro from '@tarojs/taro';

const USE_CLOUD = false; // 切换到 true 时启用 CloudBase（需先接入 SDK）

// -------- CloudBase 占位实现 --------

function cloudGet<T>(key: string): T | null {
  // TODO: 接入 CloudBase 后替换为真实数据库查询
  // 当前降级到 local
  return localGet<T>(key);
}

function cloudSet<T>(key: string, data: T): void {
  // TODO: 接入 CloudBase 后替换为真实数据库写入
  localSet(key, data);
}

function cloudList<T>(key: string): T[] {
  // TODO: 接入 CloudBase 后替换为真实数据库查询
  return localList<T>(key);
}

function cloudSave<T>(key: string, items: T[]): void {
  // TODO: 接入 CloudBase 后替换为真实数据库批量写入
  localSave(key, items);
}

// -------- localStorage 降级实现 --------

function localList<T>(key: string): T[] {
  try {
    const data = Taro.getStorageSync(key);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function localSave<T>(key: string, items: T[]): void {
  try { Taro.setStorageSync(key, items); } catch (e) { console.error('cloud.localSave error:', e); }
}

function localGet<T>(key: string): T | null {
  try {
    const data = Taro.getStorageSync(key);
    return data ?? null;
  } catch {
    return null;
  }
}

function localSet<T>(key: string, item: T): void {
  try { Taro.setStorageSync(key, item); } catch (e) { console.error('cloud.localSet error:', e); }
}

function cloudRemove(key: string): void {
  try { Taro.removeStorageSync(key); } catch (e) { console.error('cloud.remove error:', e); }
}

// -------- 导出（接口与 local.ts 对齐）--------

export function list<T>(key: string): T[] {
  return USE_CLOUD ? cloudList<T>(key) : localList<T>(key);
}

export function save<T>(key: string, items: T[]): void {
  if (USE_CLOUD) cloudSave(key, items); else localSave(key, items);
}

export function get<T>(key: string): T | null {
  return USE_CLOUD ? cloudGet<T>(key) : localGet<T>(key);
}

export function set<T>(key: string, item: T): void {
  if (USE_CLOUD) cloudSet(key, item); else localSet(key, item);
}

export function remove(key: string): void {
  cloudRemove(key);
}

/**
 * 按指定字段去重合并（存在则覆盖，不存在则追加），并按该字段排序
 * 与 local.ts 中 upsert 接口保持一致
 */
export function upsert<T>(key: string, item: T, matchKey: keyof T): T[] {
  const items = list<T>(key);
  const idx = items.findIndex(it => it[matchKey] === item[matchKey]);
  if (idx >= 0) items[idx] = item;
  else items.push(item);
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
