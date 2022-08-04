<template>
  <div :class="['g-fill', props.type]"></div>
</template>

<script lang="ts" setup>
const props = defineProps({
 type: {
    type: String,
    required: false,
    default: 'default'
  }
})
</script>

<style scoped lang="scss">
.g-fill {
  display: block;
  width: 100%;

  &.default {
    height: 182px;
  }

  &.high {
    height: 250px;
  }
}
</style>
