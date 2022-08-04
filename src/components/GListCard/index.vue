<template>
  <div class="g-list-card">
    <div
      v-for="(item, key) in data"
      :key="key"
      class="item"
      :class="{'break-line': breakLine}"
      @click="toOtherPage(item)"
    >
      <div class="row-left">
        <svg-icon className="icon" :iconClass="'icon-' + item.icon" v-if="item.icon" />
        {{ item[getProperty(props, 'name', 'name')] }}
      </div>
      <slot :data="item">
        <div
          class="row-right"
          :class="{ 'black-style': item[getProperty(props, 'url', 'url')] }"
          :style="contentStyle(item)"
        >
          {{ item[getProperty(props, 'value', 'value')] }}
          <!-- <i
            v-if="item[getProperty(props, 'url', 'url')]"
            class="icon-left"
          /> -->
          <svg-icon className="icon" iconClass="icon-arrow" class="icon-left" v-if="item[getProperty(props, 'url', 'url')]" />
        </div>
      </slot>
    </div>
    <slot name="content" />
  </div>
</template>

<script lang="ts" setup>
import { get } from 'lodash-es'
import { gotoPage } from '@/utils/utils'
import SvgIcon from '@/components/SvgIcon/index.vue'
const emit = defineEmits(['change'])
const propsObj = defineProps({
  // 数据源
  data: {
    type: Array,
    required: true,
    default: () => {
      return []
    }
  },
  // 数据解析
  props: {
    type: Object,
    required: false,
    default: () => {
      return {
        name: 'name',
        value: 'value',
        url: 'url'
      }
    }
  },
  // 是否换行
  breakLine: {
    type: Boolean,
    default: false
  }
})
const contentStyle = computed(() => {
  return (data: any) => {
    let style = {}
    if (data.color) {
      style = {
        color: data.color
      }
    }
    return style
  }
})
/**
 * 获取属性
 * @source 原对象
 * @prop 属性值
 * @param replace 无属性时替换数据
 */
function getProperty(source: any, prop: any, replace?: any) {
  let replacement = ''
  if (replace) {
    replacement = replace
  }
  return get(source, prop, replacement)
}

/**
 * 跳转其他页面
 * @param row 行信息
 */
function toOtherPage(row: any) {
  emit('change', row)
  const prop = getProperty(propsObj.props, 'url', 'url')
  const url = getProperty(row, prop)
  gotoPage(url)
}
</script>

<style scoped lang="scss">
@import './index';
</style>
