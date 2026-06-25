import { View, Text, Textarea, Button } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { list, save, STORE_KEYS } from '@/shared/services/dataStore';
import './index.scss';

interface BodyRecord {
  date: string;
  weight: number;
  fat: number;
}

export default function ImportPage() {
  const [csvText, setCsvText] = useState('');

  const onImport = () => {
    if (!csvText.trim()) {
      Taro.showToast({ title: '请粘贴 CSV 数据', icon: 'none' });
      return;
    }
    const lines = csvText.trim().split(/\r?\n/);
    const records = list<BodyRecord>(STORE_KEYS.body);
    let imported = 0;

    lines.forEach((line, idx) => {
      // 跳过表头
      if (idx === 0 && /date|weight|日期|体重/i.test(line)) return;
      const cols = line.split(',').map(c => c.trim());
      const date = cols[0];
      const weight = parseFloat(cols[1]);
      if (date && !isNaN(weight) && weight > 20 && weight < 300) {
        const fat = parseFloat(cols[2]) || 0;
        const entry: BodyRecord = {
          date,
          weight: parseFloat(weight.toFixed(1)),
          fat: parseFloat(fat.toFixed(1)),
        };
        const existIdx = records.findIndex(r => r.date === date);
        if (existIdx >= 0) records[existIdx] = entry;
        else records.push(entry);
        imported++;
      }
    });

    if (imported === 0) {
      Taro.showToast({ title: '未解析到有效数据', icon: 'none' });
      return;
    }

    records.sort((a, b) => a.date.localeCompare(b.date));
    save(STORE_KEYS.body, records);
    Taro.showToast({ title: `导入 ${imported} 条`, icon: 'success' });
    setCsvText('');
    setTimeout(() => Taro.navigateBack(), 1000);
  };

  const onChooseFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['csv', 'txt'],
      success: (res) => {
        const path = res.tempFiles[0].path;
        Taro.getFileSystemManager().readFile({
          filePath: path,
          encoding: 'utf-8',
          success: (r) => setCsvText(r.data as string),
          fail: () => Taro.showToast({ title: '读取失败', icon: 'none' }),
        });
      },
      fail: () => {},
    });
  };

  return (
    <View className='import-page'>
      <View className='tip-card'>
        <Text className='tip-title'>CSV 格式</Text>
        <Text className='tip-desc'>每行：日期,体重,体脂率{'\n'}例：2025-01-20,68.5,22.1{'\n'}同日期会覆盖，体重需 20-300</Text>
      </View>

      <View className='textarea-card'>
        <Textarea
          className='csv-textarea'
          placeholder='在此粘贴 CSV 数据，或点击下方选择文件...'
          value={csvText}
          onInput={(e) => setCsvText(e.detail.value)}
          autoHeight
        />
      </View>

      <View className='import-actions'>
        <Button className='btn-file' onClick={onChooseFile}>选择文件</Button>
        <Button className='btn-import' onClick={onImport}>导入</Button>
      </View>
    </View>
  );
}
