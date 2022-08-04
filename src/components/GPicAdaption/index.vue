<template>
  <div class="g-pic-adaption">
    <img :class="['img', type]" :src="picSrc" @error="error" />
  </div>
</template>

<script lang="ts" setup>
import {ref, watch, onMounted} from 'vue'
const props = defineProps({
    // 图片资源
    src: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'cube'
    },
    // 错误图片
    errorSrc: {
      type: String,
      required: false,
      default: 'null'
    },
    // 备用图片
    backupSrc: {
      type: String,
      required: false,
      default: null
    }
  })
const picSrc = ref('')
const state = ref('src')
watch(props, (newObj, oldObj) => {
      if(newObj.src != oldObj.src) {
        init()
      }
  },
  { deep: true }
)

onMounted(() => {
  init()
})

function init() {
  state.value = 'src'
  picSrc.value = props.src
}

function error(e: any) {
  if (state.value === 'src' && props.backupSrc) {
    state.value = 'backup'
    picSrc.value = props.backupSrc
    return
  }

  if (props.errorSrc) {
    state.value = 'error'
    picSrc.value = props.errorSrc
  }
}
</script>

<style scoped lang="scss">
.g-pic-adaption {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  .img {
    width: 100%;
    height: 100%;

    &.cube {
      border-radius: 0;
    }

    &.circle {
      border-radius: 50%;
    }
  }
}
</style>
