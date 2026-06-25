/**
 * CloudBase 数据同步实现
 *
 * 生产实现：通过 @cloudbase/js-sdk 读写云端数据库
 * 离线降级：失败时回退到 localStorage（Taro.get/setStorageSync）
 *
 * 使用方式：
 *   import { list, save, get, set, remove, upsert } from './cloud';
 *   // 首次初始化（在小程序 App.onLaunch 里调用一次）
 *   import { initCloudBase } from './cloud';
 *   initCloudBase();
 */

import Taro from '@tarojs/taro';
import cloudbase from '@cloudbase/js-sdk';

// ========== 初始化 ==========

let cloudApp: any = null;
let cloudReady = false;
let currentOpenId: string | null = null;

/**
 * 初始化 CloudBase
 * 在小程序端：会自动获取登录态
 * 在 H5 端：需要先用自定义登录
 */
export function initCloudBase() {
  if (cloudApp) return cloudApp;

  cloudApp = cloudbase.init({
    env: 'shoreos-d3gvi1l8qa5c37ff3', // 你的 CloudBase 环境 ID
  });

  // 匿名登录（小程序/H5 均支持）
  cloudApp
    .auth()
    .anonymousAuthProvider()
    .signIn()
    .then((res: any) => {
      cloudReady = true;
      currentOpenId = res?.user?.uid || null;
      console.log('[CloudBase] 匿名登录成功', currentOpenId);
    })
    .catch((err: any) => {
      console.warn('[CloudBase] 匿名登录失败，将使用本地存储', err);
      cloudReady = false;
    });

  return cloudApp;
}

export function isCloudReady(): boolean {
  return cloudReady;
}

export function getOpenId(): string | null {
  return currentOpenId;
}

// ========== 工具函数 ==========

/** 获取集合引用 */
function coll(name: string) {
  if (!cloudApp) initCloudBase();
  return cloudApp?.database?.().collection(name);
}

/** 安全地操作：cloud 失败时降级到 localStorage */
function fallback<T>(fn: () => Promise<T>, localFn: () => T): Promise<T> {
  return fn().catch((err: any) => {
    console.warn('[CloudBase] 云端操作失败，降级本地', err);
    return localFn();
  });
}

// ========== 业务接口（与 local.ts 对齐）==========

export async function list<T>(key: string): Promise<T[]> {
  return fallback(
    async () => {
      const c = coll(key);
      const res = await c.where({ _openid: currentOpenId }).get();
      return res.data || [];
    },
    () => {
      try { return Taro.getStorageSync(key) || []; } catch { return []; }
    }
  );
}

export async function get<T>(key: string): Promise<T | null> {
  return fallback(
    async () => {
      const c = coll(key);
      const res = await c.where({ _openid: currentOpenId }).limit(1).get();
      return res.data?.[0] || null;
    },
    () => {
      try { return Taro.getStorageSync(key) || null; } catch { return null; }
    }
  );
}

export async function set<T>(key: string, item: T): Promise<void> {
  return fallback(
    async () => {
      const c = coll(key);
      // 先查是否已存在
      const existing = await c.where({ _openid: currentOpenId }).get();
      if (existing.data?.length > 0) {
        await c.doc(existing.data[0]._id).set(item);
      } else {
        await c.add({ ...item, _openid: currentOpenId });
      }
    },
    () => {
      try { Taro.setStorageSync(key, item); } catch (e) { console.error(e); }
    }
  );
}

export async function save<T>(key: string, items: T[]): Promise<void> {
  return fallback(
    async () => {
      const c = coll(key);
      // 全量替换：先删后插
      const existing = await c.where({ _openid: currentOpenId }).get();
      const deleteAll = existing.data?.map((d: any) => c.doc(d._id).remove()) || [];
      await Promise.all(deleteAll);
      await Promise.all(items.map((item: any) => c.add({ ...item, _openid: currentOpenId })));
    },
    () => {
      try { Taro.setStorageSync(key, items); } catch (e) { console.error(e); }
    }
  );
}

export async function remove(key: string): Promise<void> {
  return fallback(
    async () => {
      const c = coll(key);
      const existing = await c.where({ _openid: currentOpenId }).get();
      await Promise.all(existing.data?.map((d: any) => c.doc(d._id).remove()) || []);
    },
    () => {
      try { Taro.removeStorageSync(key); } catch (e) { console.error(e); }
    }
  );
}

export async function upsert<T>(key: string, item: T, matchKey: keyof T): Promise<T[]> {
  const items = await list<T>(key);
  const idx = items.findIndex((it: T) => it[matchKey] === item[matchKey]);
  if (idx >= 0) items[idx] = item;
  else items.push(item);
  items.sort((a: any, b: any) => (a[matchKey] < b[matchKey] ? -1 : 1));
  await save(key, items);
  return items;
}
