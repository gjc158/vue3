<template>
  <div class="g-success-result">
    <div class="top">
      <svg-icon className="icon-success" iconClass="icon-status-success" />
      <span class="title" v-if="props.title">{{ props.title }}</span>
      <div class="sub-title" v-html="props.subTitle" v-if="props.subTitle"></div>
    </div>
    <div class="middle">
      <div v-for="(item, key) in props.data" :key="key" class="bottom-row">
        <span class="name">
          {{ item.name }}
        </span>
        <span class="value" :style="{ color: item.color }">
          {{ item.value }} {{item.money? '元': ''}}
        </span>
      </div>
    </div>
    <div class="btn-div">
      <van-button
        type="primary"
        size="large"
        v-if="props.urlHomeType === 'web' && props.urlHome"
        @click="gotoPage(props.urlHome, {})"
        >{{ props.urlHomeText }}</van-button
      >
      <van-button
        type="primary"
        size="large"
        v-if="props.urlHomeType === 'mini' && props.urlHome"
        @click="gotoMini(props.urlHome)"
        >{{ props.urlHomeText }}</van-button
      >
      <div class="g-fix-bottom-btn border-top-none">
        <van-button
          plain
          type="primary"
          size="large"
          v-if="props.url"
          @click="gotoPage(props.url, props.query)"
          >{{ props.urlText }}</van-button
        >
    </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import router from '@/router/index.js'

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
    data: {
      type: Array,
      required: false,
      default() {}
    },
    url: {
      type: String,
      required: false,
      default: ''
    },
    urlText: {
      type: String,
      required: false,
      default: ''
    },
    urlHome: {
      type: String,
      required: false,
      default: ''
    },
    urlHomeType: {
      type: String,
      required: false,
      default: 'web'
    },
    urlHomeText: {
      type: String,
      required: false,
      default: ''
    },
    query: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
})


function gotoPage(url: string, query: any) {
  router.push({
    path: url,
    query: query
  })
}

function gotoMini(url: string) {
  wx.miniProgram.navigateTo({
    url: `/pages${url}/main`
  })
}
</script>

<style scoped lang="scss">
.g-success-result {
  padding: 0 $margin-2;

  .top {
    width: 100%;
    padding-top: 80px;
    padding-bottom: 109px;
    border-bottom: 1px solid $border-color;
    margin-bottom: $margin-2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon-success {
      font-size: 120px;
      color: $theme-color;
    }

    .title {
      color: $theme-color;
      font-size: $font-size-max;
      line-height: 68px;
      margin-top: 24px;
    }

    .sub-title {
      text-align: center;
      color: $text-color-secondary;
      line-height: 44px;
      font-size: $font-size-md;
      width: 450px;
      margin-top: 24px;
    }
  }

  .middle {
    margin-top: $margin-2;
    padding-bottom: 180px;

    .bottom-row {
      margin-top: $margin-2;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: $font-size-md;
      line-height: 42px;

      .name {
        color: $text-color;
      }

      .value {
        color: $text-color-dark;
      }
    }
  }

  .btn-div {
    // & > button {
    //   margin: $margin 0;
    // }

    // & > button:first-child {
    //   margin-top: unset;
    // }

    display: flex;
    justify-content: center;
    align-content: center;
  }
  .border-top-none{
    border-top: none;
  }
}
</style>
