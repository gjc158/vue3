<template>
  <div class="g-popup-component">
    <van-popup
      v-model:show="show"
      v-bind="$attrs"
      :position="position"
      round
      :closeable="false"
      :style="{ height: height }"
      @close="handleClose()"
    >
      <div class="head">
        <div v-if="title" class="title">
          {{ title }}
        </div>
        <svg-icon className="icon-close-btn" iconClass="icon-close" @click="handleClose" />
      </div>
      <div class="content">
        <div v-if="content">
          {{ content }}
        </div>
        <slot name="content"></slot>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
const emit = defineEmits(['update:visible'])
const props =defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  // 弹出层位置
  position: {
    type: String,
    required: false,
    default: 'bottom'
  },
  // 高度
  height: {
    type: String,
    required: false,
    default: '74%'
  },
  // 标题
  title: {
    type: String,
    required: false,
    default: ''
  },
  // 内容
  content: {
    type: String,
    required: false,
    default: ''
  }
})

const show = ref(false)


watchEffect( ()=> {
  console.info(show)
  show.value = props.visible
})
/**
 * 处理关闭
 */
function handleClose() {
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
:deep(.van-popup) {
  display: flex;
  flex-direction: column;
}

.head {
  width: 100%;
  height: 166px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding: 0 $margin-2;
  box-sizing: border-box;

  .icon-close-btn {
    width: 56px;
    height: 56px;
    color: $arrow-color;
    position: absolute;
    right: 40px;
  }
}

.title {
  font-weight: $font-weight-bold;
  font-size: $font-size-xxl;
  color: $text-color-dark;
  font-family: $font-medium;
}

.content {
  width: 100%;
  box-sizing: border-box;
  color: #5f6370;
  font-size: $font-size-md;
  flex: 1;
  overflow: auto;
  padding: 0 20px;
}
</style>
