<script lang="ts" setup>
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor/editor';

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { uploadImage } from '#/api/iras/article';

import '@wangeditor/editor/dist/css/style.css';

interface Props {
  modelValue?: string;
  placeholder?: string;
  height?: number | string;
  mode?: 'default' | 'simple';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: 500,
  mode: 'default',
  disabled: false,
});

const emit = defineEmits<{
  change: [value: string];
  'update:modelValue': [value: string];
}>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
const valueHtml = ref(props.modelValue);

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [],
};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.disabled,
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      async customUpload(
        file: File,
        insertFn: (url: string, alt: string, href: string) => void,
      ) {
        try {
          const response = await uploadImage(file);
          if (response.code === 0 || response.code === 200) {
            // 插入图片到编辑器
            insertFn(response.data, file.name, response.data);
          } else {
            console.error('图片上传失败:', response.message);
          }
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      },
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) return;
  editor?.destroy();
});

// 编辑器创建完成
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

// 编辑器内容改变
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml();
  valueHtml.value = html;
  emit('update:modelValue', html);
  emit('change', html);
};

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal || '';
    }
  },
);

// 监听禁用状态
watch(
  () => props.disabled,
  (newVal) => {
    const editor = editorRef.value;
    if (editor === null) return;
    if (newVal) {
      editor?.disable();
    } else {
      editor?.enable();
    }
  },
);

// 获取编辑器实例
const getEditor = () => editorRef.value;

// 获取编辑器内容
const getHtml = () => editorRef.value?.getHtml() || '';
const getText = () => editorRef.value?.getText() || '';

// 设置编辑器内容
const setHtml = (html: string) => {
  editorRef.value?.setHtml(html);
};

// 清空编辑器内容
const clear = () => {
  editorRef.value?.clear();
};

// 暴露方法给父组件
defineExpose({
  getEditor,
  getHtml,
  getText,
  setHtml,
  clear,
});
</script>

<template>
  <div class="wang-editor-container">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
      class="wang-editor-toolbar"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
      class="wang-editor-content"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<style scoped>
.wang-editor-container {
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.wang-editor-toolbar {
  border-bottom: 1px solid #ccc;
}

.wang-editor-content {
  overflow-y: auto;
}

/* 暗色主题适配 */
:deep(.w-e-text-container) {
  color: var(--foreground);
  background-color: var(--background);
}

:deep(.w-e-toolbar) {
  background-color: var(--background);
  border-bottom-color: var(--border);
}
</style>
