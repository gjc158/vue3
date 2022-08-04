<template>
  <van-tabs
    v-model:active="tabValue"
    v-bind="$attrs"
    @change="handleChange"
  >
    <van-tab
      v-for="(tabItem, tabIndex) in props.data"
      :key="tabIndex"
      :name="tabItem.id"
      :title="tabItem.name"
    >
      <!--插槽头部公共区域-->
      <slot name="commonHead"/>
      <!-- 插槽区域 -->
      <slot
        v-if="tabItem.id"
        :name="tabItem.id"
      />
    </van-tab>
  </van-tabs>
</template>

<script lang="ts" setup>
const emit = defineEmits(['tabChange', 'update:current'])
const props = defineProps({
  // tab绑定
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
const tabValue = ref('')

watchEffect(() => {
  tabValue.value = props.current
})

/**
 * 处理标签改变
 * @param val 改变后的tab值
 */
function handleChange(val: any) {
  nextTick(() => {
    emit('update:current', tabValue.value)
    emit('tabChange', val)
  })
}
  

</script>

<style scoped lang="scss">
:deep(.van-tab__text--ellipsis) {
  line-height: initial;
}
</style>
