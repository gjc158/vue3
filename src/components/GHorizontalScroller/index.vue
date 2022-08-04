<template>
  <div ref="viewStage" class="g-horizontal-scrolling-component">
    <div
      ref="realContent"
      class="view"
      :style="style"
      @touchstart="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div v-for="(item, key) in props.data" :key="key" class="scroller-content">
        <div
          :class="['normal-box', active === item.value ? 'active': '']"
          @click.stop="tabCurrent(item)"
        >
          <span class="name">{{ item.name }}</span>
          <span class="value">{{ item.id }}</span>
        </div>
      </div>
    </div>
    <div v-if="nowX !== -maxWidth || nowX === 0" class="layer" />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['tabChange'])
const props = defineProps({
  current: {
    type: String,
    required: true,
    default: ''
  },
  data: {
    type: Array,
    required: true,
    default() {}
  }
})
const currentInstance: any = getCurrentInstance()
const isMove = ref(false)
const startX = ref(0)
const nowX = ref(0)
const prePositionX = ref(0)
const maxWidth = ref(0)
const active = ref('')

const style = computed(() => {
  return {
    left: `${nowX.value}px`
  }
})

onMounted(() =>{
  active.value = props.current
})

watchEffect(() => {
  active.value = props.current
})
/**
 * 处理手机触摸按下事件
 * @param e 原生事件
 */
function handleTouchStart(e: any) {
  startX.value = e.touches[0].clientX
  isMove.value = true
}
/**
 * 处理手机触摸移动事件
 * @param e 原生事件
 */
function handleTouchMove(e: any) {
  if (isMove.value) {
    let posX = e.touches[0].clientX
    if (!maxWidth.value) {
      maxWidth.value = currentInstance.refs.realContent.clientWidth - currentInstance.refs.viewStage.clientWidth
    }
    let maxWidthf = maxWidth.value
    // 表示可视宽度大于实际宽度，不需要滚动
    if (maxWidthf <= 0) {
      return
    }

    nowX.value = prePositionX.value + posX - startX.value
    // 判断是否超过边界
    if (nowX.value > 0) {
      nowX.value = 0
    }
    if (nowX.value < -maxWidthf) {
      nowX.value = -maxWidthf
    }
  }
}
/**
 * 处理手机触摸结束事件
 * @param e 原生事件
 */
function handleTouchEnd() {
  isMove.value = false
  prePositionX.value = nowX.value
}

function tabCurrent(item: any) {
  active.value = item.value
  emit('tabChange', item)
}
</script>

<style scoped lang="scss">
.g-horizontal-scrolling-component {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;

  .view {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .scroller-content {
      width: 106px;
      height: 116px;

      .normal-box {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.active {
          background-color: $theme-color;

          & > span {
            color: $white;
          }
        }
      }

      .name {
        font-size: 26px;
        color: $text-color;
        line-height: 37px;
      }

      .value {
        color: $text-color-dark;
        font-size: $font-size-sm;
        font-weight: 500;
        line-height: 37px;
        margin-top: 6px;
      }
    }
  }

  .layer {
    z-index: 2;
    width: 70px;
    height: 120px;
    position: absolute;
    right: 0;
    background: linear-gradient(90deg,#fff3 0%,#fff 100%);
  }
}
</style>
