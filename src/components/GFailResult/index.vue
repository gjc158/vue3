<template>
  <div class="g-fail-result">
    <van-dialog
      v-model:show="show"
      :confirm-button-text="urlText"
      v-bind="$attrs"
    >
      <template #default>
        <div class="vertical-center dialog-div">
          <svg-icon icon-class="icon-status-fail" class-name="icon-status" />
          <div class="title">
            {{ title }}
          </div>
          <div class="vertical-center text-normal-style" v-html="subTitle"></div>
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  subTitle: {
    type: String,
    required: false,
    default: ''
  },
  url: {
    type: String,
    required: false,
    default: ''
  },
  urlType: {
    type: String,
    required: false,
    default: 'web'
  },
  urlText: {
    type: String,
    required: true,
    default: ''
  }
})
const show = ref(false)
 
onMounted(() => {
  show.value = true
})
</script>

<style scoped lang="scss">
.g-fail-result {
  .vertical-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: $font-size-max;
    line-height: 68px;
    margin: 24px 0 32px 0;
    color: $orange;
  }

  .text-normal-style {
    text-align: center;
    color: $text-color-secondary;
    font-weight: $font-weight-bold;
    line-height: 44px;
    font-size: $font-size-md;
  }

  .icon-status {
    width: 120px;
    height: 120px;
    color: $orange;
  }

  .dialog-div {
    padding: 80px 0 118px 0;
  }
}
</style>
