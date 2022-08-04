<template>
  <div v-show="visible" class="g-pop-select">
    <div class="g-pop-mask" @click="closeMask" />
    <div class="g-pop-content" :class="visible ? 'cover-show' : ''">
      <div class="g-pop-main">
        <div class="head">
          <h2>请选择</h2>
          <img class="icon-close-btn" src="@/assets/images/pop/icon-pop-close.png" alt="" @click="closeMask" />
        </div>
        <div class="content">
          <div class="g-select-list">
            <div v-for="(item, index) in list" :key="index" class="item" :class="currentInd === index ? 'active' : ''" @click="handleClick(item, index)">
              <div class="item-inner">
                <h2>{{ item.name }}</h2>
              </div>
            </div>
          </div>
        </div>
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Array<any>,
      required: false,
      default: () => {}
    }
  })
const currentInd = ref(0)
const list = ref<Array<any>>(props.data)

watchEffect(() => {
  list.value = props.data || []
  
})
const emit = defineEmits(['update:visible', 'confirm'])
function closeMask() {
  emit('update:visible', false)
}
function handleClick(item: any, ind: any) {
  currentInd.value = ind
  emit('update:visible', false)
  emit('confirm', ind)
}
onUpdated(() => {
  console.info(list.value)

})
</script>
<style scoped lang="scss">
.g-pop-select {
  .g-pop-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 101;
    background: rgba(0, 0, 0, 0.6);
  }
  .g-pop-content {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 102;
    background: #ffffff;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    .g-pop-main {
      padding: 0 40px 84px;
      display: flex;
      flex-direction: column;
      .head {
        position: relative;
        h2 {
          color: #303133;
          font-size: 42px;
          padding: 60px 0 21px;
        }
        .icon-close-btn {
          position: absolute;
          top: 48px;
          right: -12px;
          width: 80px;
          height: 80px;
        }
      }
      .content {
        flex: 1;
        overflow-y: auto;
        max-height: 665px;
        .g-select-list {
          .item {
            padding: 30px 85px 30px 0;
            border-bottom: 2px solid #f5f5f5;
            position: relative;
            opacity: 0.8;
            &.active {
              .item-inner {
                h2{
                  color: $blue;
                }
                &::after {
                  content: '';
                  position: absolute;
                  right: 40px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 36px;
                  height: 28px;
                  background: url('@/assets/images/pop/icon-selected.png') no-repeat top left;
                  background-size: 100% 100%;
                }
              }
            }
            .item-inner {
              display: flex;
              align-items: center;
              img {
                width: 50px;
                height: 50px;
                margin-right: 21px;
              }
              h2 {
                font-size: 32px;
                color: #222222;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }
}
@-webkit-keyframes cover-show {
  0% {
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
@keyframes cover-show {
  0% {
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
.cover-show {
  -webkit-animation-name: cover-show;
  animation-name: cover-show;
  animation-fill-mode: both;
  animation-duration: 0.4s;
}
</style>
