<template>
  <div :class="['g-search', hasMarginBottom ? 'g-has-margin-bottom' : '']">
    <slot name="headLeft"/>
    <van-search
      :placeholder="placeholder"
      left-icon="icon-search"
      clearable
      v-bind="$attrs"
      v-model="modelValue"
      @focus="handleFocus"
      @blur="handleBlur"
      @search="handleSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isShowAction = ref(false)
const props = defineProps({
  placeholder: {
    type: String,
    required: false,
    default: '请输入医院名称搜索'
  },
  hasMarginBottom: {
    type: Boolean,
    required: false,
    default: true
  },
  // 下拉框选中值
  menu: {
    type: String,
    required: false,
    default: '请选择'
  },
  // 是否聚焦
  isFocus: {
    type: Boolean,
    required: false,
    default: false
  },
  value: {
    type: String,
    required: false,
    default: ''
  }
})
const modelValue = ref(props.value)
const emits = defineEmits(['gotoSearchPage', 'search', 'update:value'])

function handleFocus() {
  isShowAction.value = true
  if (props.isFocus) {
    emits('gotoSearchPage', '')
  }
}

function handleBlur() {
  isShowAction.value = false
}

function handleSearch(val: any) {
  emits('search', val)
}

</script>

<style scoped lang="scss">
  .g-search {
    width: 100%;
    height: 100%;
    background: $white;
    padding:20px 40px;
    box-sizing: border-box;
    position: relative;
  }
  :deep(.van-search){
    padding: 0;
  }
  :deep(.van-search__content){
    border-radius: 8px;
    padding-left: 12px;
  }
  :deep(.van-search .van-cell){
    padding: 16px;
  }

</style>
