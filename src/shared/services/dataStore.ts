/**
 * dataStore — 统一数据访问层
 *
 * 通过 USE_CLOUD 开关切换 local / cloud 实现。
 * 调用方只依赖这里的接口，不直接碰 local / cloud。
 */
import * as localImpl from './local';
import * as cloudImpl from './cloud';

const USE_CLOUD = false; // 改为 true 时启用 CloudBase 云端同步

let activeImpl: typeof localImpl;

if (USE_CLOUD) {
  // 初始化 CloudBase（仅一次）
  cloudImpl.initCloudBase();
  activeImpl = cloudImpl;
} else {
  activeImpl = localImpl;
}

const { list, save, upsert, get, set, remove } = activeImpl;

export { list, save, upsert, get, set, remove };

/** 业务存储 key 集中管理 */
export const STORE_KEYS = {
  body: 'shoreos_body',
  fireInput: 'shoreos_fire_input',
  fireResult: 'shoreos_fire_result', // 计算结果持久化
  targetWeight: 'shoreos_target_weight',
  finance: 'shoreos_finance',      // 记账模块
} as const;
