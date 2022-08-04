<!--医生列表-->
<template>
  <div class="g-doctor-list-item">
    <div class="doctor-item" @click="goPage">
      <img :class="['avatar', props.avatarShape]" :src="renderAvatar" alt="" srcset="" @error="renderErrorAvatar()"/>
      <div :class="['info', props.url ? 'has-url' : '']">
        <div class="label">
          {{ name }}
          <div class="level" v-if="props.level">
            <img class="icon" :src="renderLevel" alt="" srcset="" />
            <span class="name">{{ doctorLevel }}</span>
            <slot name="level" />
          </div>
          <div class="price" v-if="props.price">
            {{ priceFmt }}
          </div>
        </div>
        <div class="desc">{{ props.desc || '暂无描述' }}</div>
        <slot name="content" />
      </div>
      <div class="arrow" v-if="props.url">
        <!-- <svg-icon v-if="props.isShowIcon" :className="'nav-icon'" iconClass="icon-arrow" /> -->
        <slot name="svg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { doctorLevelFmt } from '@/utils/utils'
import { useRouter } from 'vue-router'
// import SvgIcon from '@/components/SvgIcon/index.vue'

import maleImg from '@/assets/images/icon-man.png'
import femaleImg from '@/assets/images/icon-woman.png'
import neutralImg from '@/assets/images/icon-neutral.png'
import rankHigh from '@/assets/images/rank-high.png'
import rankMedium from '@/assets/images/rank-medium.png'
import rankLow from '@/assets/images/rank-low.png'

const router = useRouter()
const props = defineProps({
// 姓名
    name: {
      type: String,
      required: false,
      default: ''
    },
    // 性别
    gender: {
      type: [Number, String],
      required: false,
      default: '男'
    },
    // 头像
    avatar: {
      type: String,
      required: false,
      default: ''
    },
    // 职称（例如：主任医师）
    level: {
      type: String,
      required: false,
      default: ''
    },
    // 价格
    price: {
      type: String,
      required: false,
      default: ''
    },
    // 简介描述
    desc: {
      type: String,
      required: false,
      default: ''
    },
    // 跳转路由
    url: {
      type: [String, Boolean],
      required: false,
      default: ''
    },
    // 头像形状
    avatarShape: {
      type: String,
      required: false,
      default: 'round'
    },
    isShowIcon: {
      type: Boolean,
      required: false,
      default: true
    }
})

const doctorLevel = computed(() =>{
  return doctorLevelFmt(props.level)
})

const priceFmt = computed(() => {
  return `¥${Number(props.price).toFixed(2)}`
})

const renderAvatar = computed(() => {
  if (!props.avatar) {
    let gender:string|number = props.gender || '男'

    if (gender === '男' || gender === 1 || gender === '1') {
      return maleImg
    } else if (gender === '女' || gender === 2 || gender === '2') {
      return femaleImg
    } else {
      return neutralImg
    }
  } else {
    return props.avatar
  }
})

const renderLevel = computed(() => {
  if (props.level) {
    if (props.level === '3' || props.level === '4') {
      return rankHigh
    } else if (props.level === '2') {
      return rankMedium
    } else if (props.level === '1') {
      return rankLow
    } else {
      return rankLow
    }
  } else {
    return rankLow
  }
})

function renderErrorAvatar() {
  let gender = props.gender || '男'
  let imgUrl = ''
  if (gender === '男' || gender === 1 || gender === '1') {
    imgUrl = maleImg
  } else if (gender === '女' || gender === 2 || gender === '2') {
    imgUrl = femaleImg
  } else {
    imgUrl = neutralImg
  }
  // const img = event.srcElement
  // img.src = imgUrl
  // img.onerror = null
}


function goPage() {
  if(typeof(props.url)  === "string" && props.url){
    router.push(props.url)
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
