import { View, Text, Input, Picker } from '@tarojs/components';
import { useState, useRefect } from 'react';
import Taro from '@tarojs/taro';
import { list, save, remove, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

export interface FinanceRecord {
  id: string;           // 本地 uuid
  amount: number;       // 金额（元，正数）
  type: 'expense' | 'income';
  category: string;      // 分类：餐饮/交通/购物/工资/兼职...
  note: string;          // 备注
  date: string;          // YYYY-MM-DD
  createdAt: number;     // 时间戳
}

const CATEGORIES = {
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '其他'],
  income:  ['工资', '兼职', '投资', '红包', '其他'],
};

export default function FinancePage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<FinanceRecord>>({
    type: 'expense',
    category: '餐饮',
    amount: 0,
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // 加载数据
  useRefect(() => {
    const data = list<FinanceRecord>(STORE_KEYS.finance);
    setRecords(data.sort((a, b) => (a.date > b.date ? -1 : 1)));
  }, []);

  const saveRecord = () => {
    if (!form.amount || form.amount <= 0) {
      Taro.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }
    const record: FinanceRecord = {
      id: form.id || Date.now().toString(),
      amount: Number(form.amount),
      type: form.type as any,
      category: form.category || '',
      note: form.note || '',
      date: form.date || new Date().toISOString().slice(0, 10),
      createdAt: form.id ? (form as any).createdAt : Date.now(),
    };
    const data = list<FinanceRecord>(STORE_KEYS.finance);
    const idx = data.findIndex(r => r.id === record.id);
    if (idx >= 0) data[idx] = record; else data.unshift(record);
    save(STORE_KEYS.finance, data);
    setRecords([...data].sort((a, b) => (a.date > b.date ? -1 : 1)));
    setShowForm(false);
    setForm({ type: 'expense', category: '餐饮', amount: 0, note: '', date: new Date().toISOString().slice(0, 10) });
    Taro.showToast({ title: '已保存', icon: 'success' });
  };

  const deleteRecord = (id: string) => {
    const data = list<FinanceRecord>(STORE_KEYS.finance).filter(r => r.id !== id);
    save(STORE_KEYS.finance, data);
    setRecords(data.sort((a, b) => (a.date > b.date ? -1 : 1)));
  };

  // 统计本月收支
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthIncome = records.filter(r => r.date.startsWith(monthStr) && r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const monthExpense = records.filter(r => r.date.startsWith(monthStr) && r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  return (
    <View className='finance-page'>
      {/* 月度概览 */}
      <View className='finance-summary'>
        <View className='summary-item income'>
          <Text className='summary-label'>本月收入</Text>
          <Text className='summary-value'>{monthIncome.toFixed(0)}</Text>
        </View>
        <View className='summary-divider' />
        <View className='summary-item expense'>
          <Text className='summary-label'>本月支出</Text>
          <Text className='summary-value'>{monthExpense.toFixed(0)}</Text>
        </View>
        <View className='summary-divider' />
        <View className='summary-item balance'>
          <Text className='summary-label'>结余</Text>
          <Text className='summary-value'>{(monthIncome - monthExpense).toFixed(0)}</Text>
        </View>
      </View>

      {/* 记录列表 */}
      <View className='record-list'>
        {records.length === 0 && (
          <View className='empty-tip'><Text>暂无记录，点击 + 添加</Text></View>
        )}
        {records.map(r => (
          <View key={r.id} className='record-item' onClick={() => {
            setForm(r);
            setShowForm(true);
          }}>
            <View className='record-left'>
              <Text className='record-cate'>{r.category}</Text>
              <Text className='record-note'>{r.note || '无备注'}</Text>
              <Text className='record-date'>{r.date}</Text>
            </View>
            <View className='record-right'>
              <Text className={`record-amt ${r.type}`}>
                {r.type === 'income' ? '+' : '-'}{r.amount.toFixed(0)}
              </Text>
              <View className='record-del' onClick={(e) => { e.stopPropagation(); deleteRecord(r.id); }}>
                <Text>🗑</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 添加按钮 */}
      {!showForm && (
        <View className='fab-btn' onClick={() => setShowForm(true)}>
          <Text>+</Text>
        </View>
      )}

      {/* 输入表单（底部抽屉） */}
      {showForm && (
        <View className='form-drawer'>
          <View className='form-header'>
            <Text className='form-title'>{form.id ? '编辑记录' : '新增记录'}</Text>
            <Text className='form-close' onClick={() => setShowForm(false)}>✕</Text>
          </View>

          {/* 类型切换 */}
          <View className='type-switch'>
            {(['expense', 'income'] as const).map(t => (
              <View
                key={t}
                className={`type-btn ${form.type === t ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, type: t, category: CATEGORIES[t][0] }))}
              >
                <Text>{t === 'expense' ? '支出' : '收入'}</Text>
              </View>
            ))}
          </View>

          {/* 分类选择 */}
          <View className='form-row'>
            <Text className='form-label'>分类</Text>
            <Picker
              mode='selector'
              range={CATEGORIES[form.type || 'expense']}
              value={CATEGORIES[form.type || 'expense'].indexOf(form.category || '')}
              onChange={(e) => setForm(f => ({ ...f, category: CATEGORIES[f.type || 'expense'][e.detail.value] }))}
            >
              <View className='form-picker'>{form.category || '请选择'}</View>
            </Picker>
          </View>

          {/* 金额 */}
          <View className='form-row'>
            <Text className='form-label'>金额（元）</Text>
            <Input
              className='form-input'
              type='digit'
              placeholder='0.00'
              value={form.amount ? String(form.amount) : ''}
              onInput={(e) => setForm(f => ({ ...f, amount: parseFloat(e.detail.value) || 0 }))}
            />
          </View>

          {/* 日期 */}
          <View className='form-row'>
            <Text className='form-label'>日期</Text>
            <Picker
              mode='date'
              value={form.date || ''}
              onChange={(e) => setForm(f => ({ ...f, date: e.detail.value }))}
            >
              <View className='form-picker'>{form.date || '请选择'}</View>
            </Picker>
          </View>

          {/* 备注 */}
          <View className='form-row'>
            <Text className='form-label'>备注</Text>
            <Input
              className='form-input'
              placeholder='选填'
              value={form.note || ''}
              onInput={(e) => setForm(f => ({ ...f, note: e.detail.value }))}
            />
          </View>

          <View className='form-actions'>
            <View className='btn-cancel' onClick={() => setShowForm(false)}>
              <Text>取消</Text>
            </View>
            <View className='btn-save' onClick={saveRecord}>
              <Text>保存</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
