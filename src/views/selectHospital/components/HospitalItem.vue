

<script lang="ts" setup>
import { computed, ref } from 'vue'
import GPicAdaption from '@/components/GPicAdaption/index.vue'
// import { HOSPITAL_LEVEL, HOSPITAL_TYPE } from 'utils/constant.js'
import backImgUrl from '@/assets/images/hospital-default.png'
defineEmits(['handleClick'])
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
const imgUrl = ref('')
const HOSPITAL_LEVEL:any = {
  '3S': '三级特等',
  '3A': '三级甲等',
  '3B': '三级乙等',
  '3C': '三级丙等',
  '2A': '二级甲等',
  '2B': '二级乙等',
  '2C': '二级丙等',
  '1A': '一级甲等',
  '1B': '一级乙等',
  '1C': '一级丙等'
}
const hospLevel =  computed(() => {
  return HOSPITAL_LEVEL[props.data.hospitalLevel] || ''
})

const distanceFmt = computed(() => {
  if(!props.data.distance) {
    return ''
  }
  if (props.data.distance < 1000) {
    return props.data.distance + 'm'
  } else {
    return props.data.distance ? (Number(props.data.distance) / 1000).toFixed(2) + 'km' : ''
  }
})

</script>
<!--医院列表-->
<template>
  <div class="hospital-item" @click="$emit('handleClick', data)">
    <!--医院头像-->
    <div class="hospital-item__img">
      <g-pic-adaption :src="imgUrl" :backup-src="backImgUrl" />
    </div>
    <!--医院名称、地址-->
    <div class="hospital-item__content">
      <span class="hospital-item__title">{{ data.hospitalName }}</span>
      <span class="hospital-item__desc">{{ data.address }}</span>
    </div>
    <!--医院级别-->
    <div class="hospital-item__level">
      <span class="hospital-item__tags">
        <span v-if="hospLevel" class="tag">{{ hospLevel }}</span>
      </span>
      <span class="hosp-distance" v-if="data.distance">距您{{ distanceFmt }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hospital-item {
  display: flex;
  align-items: center;
  padding: 45px 0;
  box-shadow: 0px -1px 0px 0px #F5F5F5;

  &__content  {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 30px;
  }

  &__right{
    display: flex;
    align-items: center;
  }

  .tag {
    background: rgba(49, 134, 255, 0.04);
    border-radius: 4px;
    border: 1px solid #3186FF;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #3186FF;
    line-height: 28px;
    padding: 2px 10px;
  }

  .tag + .tag {
    margin-left: 14px;
  }

  &__title {
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2D343D;
    line-height: 45px;
  }

  &__desc {
    font-size: $font-size-sm;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 33px;
  }

  &__img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &__level{
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    align-items: flex-end;
    .hosp-distance{
      margin-top: 6px;
      font-size: $font-size-sm;
      font-weight: 400;
      color: #999999;
      line-height: 33px;
    }
  }
}
</style>
