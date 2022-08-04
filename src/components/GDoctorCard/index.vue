<!--医生（介绍）卡片-->
<template>
  <div :class="['g-doctor-card', props.hasMarginBottom ? 'g-has-margin-bottom' : '']">
    <div class="card-content">
      <img
        :class="['avatar', props.avatarShape]"
        :src="renderAvatar"
        alt=""
        srcset=""
      />
      <div class="info">
        <div class="label">
          {{ name }}
          <div class="level" v-if="props.level">
            <img class="icon" :src="renderLevel" alt="" srcset="" />
            <span class="name">{{ doctorLevel }}</span>
          </div>
          <div class="brief" @click="isHideBrief = !isHideBrief" v-if="props.content && props.hasFolder">
            <span>医生简介</span>
            <van-icon :name="!isHideBrief ? 'arrow-down' : 'arrow-up'" />
          </div>
        </div>
        <div class="desc">
          <span v-if="props.hospital">{{ props.hospital }} </span>
          <span v-if="props.hospital && props.department"> | </span>
          <span v-if="props.department">{{ props.department }}</span>
        </div>
      </div>
      <div
        v-if="props.content"
        :class="['text-middle', isHideBrief || !props.hasFolder ? '' : 'fixed-height']"
      >
        {{ props.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import maleImg from '@/assets/images/icon-man.png'
import femaleImg from '@/assets/images/icon-woman.png'
import neutralImg from '@/assets/images/icon-neutral.png'
import rankHigh from '@/assets/images/rank-high.png'
import rankMedium from '@/assets/images/rank-medium.png'
import rankLow from '@/assets/images/rank-low.png'
import { doctorLevelFmt } from '@/utils/utils'


const props =defineProps({
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
  // 医院
  hospital: {
    type: String,
    required: false,
    default: ''
  },
  // 科室
  department: {
    type: String,
    required: false,
    default: ''
  },
  // 内容
  content: {
    type: String,
    required: false,
    default: ''
  },
  hasMarginBottom: {
    type: Boolean,
    required: false,
    default: true
  },
  avatarShape: {
    type: String,
    required: false,
    default: 'round'
  },
  hasFolder: {
    type: Boolean,
    required: false,
    default: true
  }
})

const isHideBrief = ref(false)

const doctorLevel = computed(() => {
  return doctorLevelFmt(props.level)
})

const renderAvatar = computed(() => {
  if (!props.avatar) {
    let gender = props.gender || '男'

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
onMounted(() => {
  console.info(props)
})

onUpdated(() => {
  // console.info('更新',props)
})
</script>

<style lang="scss" scoped>
@import './index';
</style>
