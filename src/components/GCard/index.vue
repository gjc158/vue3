<template>
  <div :class="['g-card', props.hasMarginBottom ? 'g-has-margin-bottom' : '']" @click="wholeClick">
    <!--头部-->
    <div
      v-if="props.isNeedHead"
      class="card-head-div flex-style"
      @click="gotoPage(props.url)"
    >
      <slot name="headLeft">
        <div
          v-if="props.title"
          class="title second"
          :class="[{ 'has-title-active': props.hasTitleActive }]"
        >
          {{ props.title }}
        </div>
      </slot>
      <div class="flex-style">
        <slot name="headRight">
          <div v-if="props.icon" class="pic-div">
            <g-pic-adaption :src="props.icon" />
          </div>
        </slot>
        <span class="status-span" :class="props.statusCls" v-if="props.statusCls">{{ props.orderStatusStr }}</span>
        <svg-icon v-if="props.url" class-name="icon-left" icon-class="icon-arrow" />
      </div>
    </div>
    <!--内容列表-->
    <div class="card-body-div">
      <slot name="content">
        <div class="content" v-if="props.data.length > 0">
          <div
            v-for="(item, key) in props.data"
            :key="key"
            class="body-row-div flex-style"
          >
            <slot :data="item">
              <div class="row-left">
                {{ item.name }}
              </div>
              <div class="row-right" :style="{ color: item.color, fontWeight: item.bold ? 600 : 400 }">
                {{ item.value }}
              </div>
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GPicAdaption from '@/components/GPicAdaption/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import router from '@/router/index.js';

const emit = defineEmits(['headClick', 'clickEvent', 'wholeClick'])
const props = defineProps({
  // 数据源
  data: {
    type: Array,
    required: false,
    default: () => {
      return []
    }
  },
  // 是否需要头部
  isNeedHead: {
    type: Boolean,
    required: false,
    default: true
  },
  // 标题
  title: {
    type: String,
    required: false,
    default: ''
  },
  // 图标
  icon: {
    type: String,
    required: false,
    default: ''
  },
  // 头部跳转路径
  url: {
    type: String,
    required: false,
    default: ''
  },
  // 是否需要左边蓝色小标志
  hasTitleActive: {
    type: Boolean,
    required: false,
    default: true
  },
  // 是否显示底部边距
  hasMarginBottom: {
    type: Boolean,
    required: false,
    default: true
  },
  statusCls: {
    type: String,
    require: false,
    default: ''
  },
  orderStatusStr: {
    type: String,
    require: false,
    default: ''
  }
})
function gotoPage(url: any) {
  emit('headClick')
  if (url !== 'clickEvent') {
    router.push(url)
  } else {
    emit('clickEvent')
  }
}

function wholeClick() {
  emit('wholeClick')
}
</script>

<style scoped lang="scss">
@import './index';
</style>
