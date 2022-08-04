

<script lang="ts" setup>
import HospitalItem from './HospitalItem.vue'
import GEmpty from '@/components/GEmpty/index.vue'
import emptyImg from '@/assets/images/default-search.png'

const props = defineProps({
  // 列表绑定
  hospitalList: {
    type: Array,
    required: true,
    default: () => {
      return []
    }
  },
  // 加载中
  isLoading: {
    type: Boolean,
    required: true,
    default: true
  },
  // 结束加载标志
  finished: {
    type: Boolean,
    required: true,
    default: false
  },
  // 加载异常标志
  error: {
    type: Boolean,
    required: true,
    default: false
  },
  // 自定义高度
  height: {
    type: String,
    required: false,
    default: ''
  }
})
defineEmits(['onLoad', 'gotoPage'])
onUpdated( () => {

})
</script>

<template>
  <div class="tabs-item">
    <van-list v-if="isLoading || hospitalList.length > 0" 
      :isLoading="isLoading" 
      :finished="finished" 
      finished-text="没有更多了"
      :error="error" 
      error-text="请求失败，点击重新加载" 
      @load="$emit('onLoad')" 
      :immediate-check='false'>
      <div class="select-hospital__body">
        <hospital-item v-for="(item, index) in hospitalList" :key="index" :data="(item as any)"
          @click="$emit('gotoPage', item)"></hospital-item>
      </div>
    </van-list>
    <g-empty v-else :image="emptyImg" :height='height'></g-empty>
  </div>
</template>

<style scoped lang="scss">
.tabs-item {
  box-sizing: border-box;
  width: 100%;

  >>>.van-list__error-text,
  .van-list__finished-text,
  .van-list__loading {
    background: #fff;
  }
}

.select-hospital__body {
  padding: 0 0.4rem;
  background: #fff;
}
</style>
