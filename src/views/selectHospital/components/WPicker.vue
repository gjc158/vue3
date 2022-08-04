<template>
  <div class="wx-picker-box">
    <!--  选择 -->
    <div class="picker-item" @click="$emit('click', typeName)">
      <div v-if="value" class="picker">
        {{ value }}
      </div>
      <div v-else class="picker placeholder">{{ placeholder }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['click'])
defineProps({
  value: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  typeName: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.wx-picker-box {
  width: 100%;
  .picker-item {
    width: 100%;
    display: flex;
    padding-right: 10px;
    .picker {
      position: relative;
      color: #222222;
      font-size: 28px;
      padding-right: 36px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.placeholder {
        color: #666666;
      }
      &::after {
        content: '';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        background: url('../../../assets/images/icon-arrow-down.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
