/**
 * dataStore — 统一数据访问层
 * 第一阶段：返回 local 实现
 * 第二阶段：根据登录态切换 local / cloud（cloud 实现预留）
 *
 * 调用方只依赖这里的接口，不直接碰 local / cloud。
 */
export {
  list,
  save,
  upsert,
  get,
  set,
  remove,
} from './local';

/** 业务存储 key 集中管理 */
export const STORE_KEYS = {
  body: 'shoreos_body',
  fireInput: 'shoreos_fire_input',
  targetWeight: 'shoreos_target_weight',
} as const;
