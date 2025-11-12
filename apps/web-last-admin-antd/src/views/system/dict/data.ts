import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { SystemDictApi } from '#/api/system/dict';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

/**
 * 获取状态选项
 */
export function getStateOptions() {
  return [
    { label: $t('system.enable'), value: true, color: 'green' },
    { label: $t('system.disable'), value: false, color: 'red' },
  ];
}

/**
 * 获取状态颜色映射
 */
export function getStateColorMap() {
  const map: Record<string, string> = {};
  getStateOptions().forEach((option) => {
    map[String(option.value)] = option.color;
  });
  return map;
}

/**
 * 字典主表列配置
 */
export function useColumns(): VxeTableGridOptions<SystemDictApi.DictInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('system.dict.name'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'code',
      title: $t('system.dict.code'),
      width: 150,
    },
    {
      field: 'state',
      title: $t('system.dict.state'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state ? $t('system.enable') : $t('system.disable');
          return h(Tag, { color }, () => text);
        },
      },
    },
    {
      field: 'description',
      title: $t('system.dict.description'),
      minWidth: 150,
    },
    {
      field: 'createdAt',
      title: $t('system.createdAt'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}

/**
 * 字典子项列配置
 */
export function useDictItemColumns(): VxeTableGridOptions<SystemDictApi.DictItemInfo>['columns'] {
  const stateColorMap = getStateColorMap();

  return [
    {
      align: 'center',
      field: 'label',
      title: $t('system.dict.item.label'),
      minWidth: 150,
      editRender: {
        name: 'input',
        attrs: { placeholder: $t('system.dict.item.label') },
      },
    },
    {
      align: 'center',
      field: 'value',
      title: $t('system.dict.item.value'),
      minWidth: 150,
      editRender: {
        name: 'input',
        attrs: { placeholder: $t('system.dict.item.value') },
      },
    },
    {
      align: 'center',
      field: 'sortOrder',
      title: $t('system.dict.item.sortOrder'),
      width: 100,
      editRender: {
        name: 'input',
        attrs: {
          type: 'number',
          placeholder: $t('system.dict.item.sortOrder'),
        },
      },
    },
    {
      field: 'state',
      title: $t('system.dict.item.state'),
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const color = stateColorMap[String(row.state)];
          const text = row.state ? $t('system.enable') : $t('system.disable');
          return h(Tag, { color }, () => text);
        },
      },
      editRender: {
        name: 'select',
        options: getStateOptions(),
      },
    },
    {
      align: 'center',
      field: 'color',
      title: $t('system.dict.item.color'),
      width: 100,
      editRender: {
        name: 'input',
        attrs: { placeholder: $t('system.dict.item.color') },
      },
      slots: {
        default: ({ row }) => {
          // 验证颜色值是否有效
          const isValidColor = (color: string) => {
            if (!color || typeof color !== 'string') return false;

            // 创建一个临时元素来验证颜色值
            const tempDiv = document.createElement('div');
            const originalColor = tempDiv.style.backgroundColor;

            try {
              tempDiv.style.backgroundColor = color;
              const isValid =
                tempDiv.style.backgroundColor !== originalColor ||
                tempDiv.style.backgroundColor !== '';
              return isValid;
            } catch {
              return false;
            }
          };

          if (row.color && isValidColor(row.color)) {
            return h('div', {
              key: `color-${row.id || row.label}-${row.color}`,
              style: {
                width: '20px',
                height: '20px',
                backgroundColor: row.color,
                border: '1px solid #ccc',
                borderRadius: '4px',
                margin: '0 auto',
              },
              title: row.color, // 添加 tooltip 显示颜色值
            });
          }

          // 返回一个占位符，确保每行都有独立的渲染内容
          return h(
            'div',
            {
              key: `color-empty-${row.id || row.label}`,
              style: {
                width: '20px',
                height: '20px',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '4px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#999',
              },
              title: '无效颜色值', // 添加 tooltip 说明
            },
            '—',
          );
        },
      },
    },
    {
      field: 'css',
      title: $t('system.dict.item.css'),
      minWidth: 150,
      editRender: {
        name: 'input',
        attrs: { placeholder: $t('system.dict.item.css') },
      },
    },
    {
      field: 'description',
      title: $t('system.dict.item.description'),
      minWidth: 200,
      editRender: {
        name: 'textarea',
        attrs: {
          placeholder: $t('system.dict.item.description'),
          rows: 2,
        },
      },
    },
  ];
}

/**
 * 搜索表单配置
 */
export function useSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.dict.name'),
      },
      {
        component: 'Input',
        fieldName: 'code',
        label: $t('system.dict.code'),
      },
      {
        component: 'Input',
        fieldName: 'description',
        label: $t('system.dict.description'),
      },
    ],
  };
}

/**
 * 字典子项搜索表单配置
 */
export function useDictItemSearchFormSchemas() {
  return {
    schema: [
      {
        component: 'Input',
        fieldName: 'label',
        label: $t('system.dict.item.label'),
      },
      {
        component: 'Input',
        fieldName: 'value',
        label: $t('system.dict.item.value'),
      },
    ],
  };
}
