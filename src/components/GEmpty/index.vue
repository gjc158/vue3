<template>
  <div class="g-empty" :style='{ height: height }'>
    <van-empty :image="image" :description="description" />
  </div>
</template>

<script lang="ts" setup>
import emptyImage from '@/assets/images/default-common.png'

defineProps({
  description: {
    type: String,
    required: false,
    default: '暂无数据'
  },
  image: {
    type: String,
    required: false,
    default: emptyImage
  },
  height: {
    type: String,
    required: false,
    default: ''
  }
})

</script>

<style scoped lang="scss">
.g-empty {
  background: $white;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.van-empty__image ){
    width: 288px;
    height: 288px;
  }

  :deep(.van-empty__description) {
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 46px;
    margin-top: 10px;
  }
}
</style>
