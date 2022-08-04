<template>
  <div :class="['g-info-card', hasMarginBottom ? 'g-has-margin-bottom' : '']">
    <!--头部-->
    <div class="card-head-div flex-style" v-if="title">
      <div class="title" :class="{'small-title': smallTitle}">
        <span v-if="title">
          {{ title }}
          <span v-if="subTitle">
            <i class="icon-line" />
            {{ subTitle }}
          </span>
          <span v-if="thirdTitle">
            <i class="icon-line" />
            {{ thirdTitle }}
          </span>
          <span v-if="fourthTitle">
            <i class="icon-line" />
            {{ fourthTitle }}
          </span>
        </span>
      </div>
      <img class="avatar" :src="renderAvatar" alt="" v-if="hasAvatar"/>
    </div>
    <!--内容列表-->
    <div class="card-body-div" v-if="data">
      <slot name="content">
        <div
          v-for="(item, key) in data"
          :key="key"
          class="body-row-div flex-style"
          :class="{'break-line': breakLine}"
        >
          <div class="row-left">
            {{ item[getProperty(props, 'name', 'name')] }}
          </div>
          <div class="row-right" :style="{ color: item.color }">
            <slot :data="item">
              {{ item[getProperty(props, 'value', 'value')] }}
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { get } from 'lodash-es'
import maleImg from '@/assets/images/icon-man.png'
import femaleImg from '@/assets/images/icon-woman.png'

const props =defineProps({
  // 标题
  title: {
    type: String,
    required: false,
    default: ''
  },
  // 副标题
  subTitle: {
    type: String,
    required: false,
    default: ''
  },
  // 第三标题
  thirdTitle: {
    type: String,
    required: false,
    default: ''
  },
  // 第四标题
  fourthTitle: {
    type: String,
    required: false,
    default: ''
  },
  // 性别， 1：男性， 2：女性
  gender: {
    type: [String, Number],
    required: false,
    default: 1
  },
  // 头像
  avatar: {
    type: String,
    required: false,
    default: ''
  },
  // 数据源
  data: {
    type: Array,
    required: false,
    default() {}
  },
  hasMarginBottom: {
    type: Boolean,
    required: false,
    default: true
  },
  hasAvatar: {
    type: Boolean,
    required: false,
    default: true
  },
  smallTitle: {
    type: Boolean,
    default: false
  },
  // 是否换行
  breakLine: {
    type: Boolean,
    default: false
  },
  // 数据解析
  props: {
    type: Object,
    required: false,
    default: () => {
      return {
        name: 'name',
        value: 'value'
      }
    }
  }
})

const renderAvatar = computed(() => {
  if (!props.avatar) {
    let gender = props.gender || 1

    if (gender === 1 || gender === '1') {
      return maleImg
    }

    if (gender === 2 || gender === '2') {
      return femaleImg
    }
  } else {
    return props.avatar
  }
})
/**
 * 获取属性
 * @source 原对象
 * @prop 属性值
 * @param replace 无属性时替换数据
 */
function getProperty(source: any, prop: any, replace: any) {
  let replacement = ''
  if (replace) {
    replacement = replace
  }
  return get(source, prop, replacement)
}
</script>

<style scoped lang="scss">
@import './index';
</style>
