<template>
  <div class="subscribe-list">
    <div class="g-gray-fill"></div>
    <van-skeleton
      title
      :row="14"
      :loading="loading"
      class="skeleton-placeholder"
    >
      <div class="bg">
        <van-list
      v-if="isLoading || subscribeList.length > 0"
      v-model="isLoading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
      :immediate-check='false'
    >
        <g-card
          v-for="(item, key) in subscribeList"
          :key="key"
          url="clickEvent"
          :title="item.title"
          :data="item.list"
          @wholeClick="gotoPage(item.url)"
        >
          <template #headRight>
            <div class="normal-text" :style="{ color: item.color }">
              {{ item.status }}
            </div>
          </template>
        </g-card>
      </van-list>
        <g-empty v-if="subscribeList.length==0 && !loading"/>
      </div>
    </van-skeleton>
  </div>
</template>

<script lang="ts" setup>
import GCard from '@/components/GCard/index.vue'
import { getRecordPage, getUserCache } from '@/api/api'
import GEmpty from '@/components/GEmpty/index.vue'
import { desensitization, orderStatusFmt } from '@/utils/utils'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const router = useRouter()
const pageSize = ref(10) // 默认一次查询条数
const totalPageNum = ref(0) // 总页数
const currpageNum = ref(1) // 当前页数
const subscribeList: any = ref([])
const loading = ref(true)
const isLoading = ref(true)
const token = ref(route.query.token || store.getters['user/getUserToken'])
const businessCode = ref('00')
let userinfo: any = {} // 用户信息
const finished = ref(false)
const error = ref(false)
const currentTab = ref('00')
const orgId = ref(route.query.orgId || '')

onMounted(() => {
  getUserCacheFn()
})
    
/**
* 获取业务类型
*/
function getUserCacheFn() {
  isLoading.value = true
  getUserCache({
    token: token.value
  }).then(res => {
    console.info(res)
    businessCode.value = res.businessCode || '00'
    userinfo = res
    getData('')
  }).catch(err => {
    isLoading.value = false
    console.info(err)
  })
}

/**
 * 获取预约列表
 */
function getData(pagedata: any) {
  isLoading.value = true
  let param: any = {
    // treatUserId: userinfo.userInfo.userId,
    cardType: userinfo.cardType,
    cardNo: userinfo.cardNo,
    idType: userinfo.idType,
    idNo: userinfo.idNo,
    pageNumber: pagedata || '1',
    pageSize: pageSize.value,
    businessCode: currentTab.value
  }
  if (orgId.value) {
    param.orgId = orgId.value
  }
  getRecordPage(param).then((res: any) => {
    console.log('res=====', res)
    totalPageNum.value = res.totalPages // 总数
    res = res.content

    if (res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        const item = res[i]
        const status = orderStatusFmt(item.status)
        let color = '#999'
        switch (parseInt(item.status)) {
          case 1:
            color = '#3186FF'
            break
          case 6:
            color = '#3186FF'
            break
          case 2:
            color = '#1BBE6D'
            break
          case 9:
            color = '#FF9D0B'
            break
          default:
            color = '#999'
        }
        const url = `/subscribeDetail?recordId=${item.recordId}&businessCode=${item.businessCode}&idNo=${userinfo.idNo}`
        const phyExamUrl = `/phyExamSubscribeDetail?recordId=${item.recordId}&businessCode=${item.businessCode}&idNo=${userinfo.idNo}&orgId=${item.orgId}&centerId=${item.centerId}`
        const obj = {
          title: item.scheduleDate + ' ' + (item.sourceTime || ''),
          status: status,
          color: color,
          url: item.businessCode === '01' ? phyExamUrl : url,
          list: [
            {
              name: '就诊医院',
              value: item.hospitalName
            },
            {
              name: item.businessCode === '01' ? '体检中心' : '就诊科室',
              value: item.deptName || item.centerName
            },
            {
              name: item.businessCode === '01' ? '体检套餐' : '就诊医师',
              value: item.doctorName || item.packageName
            },
            {
              name: '就诊人',
              value: desensitization(item.name) || desensitization(item.phone)
            }]
        }
        if (pagedata) {
          console.log('pagedata=', pagedata)
          subscribeList.value = subscribeList.value.concat(obj)
        } else {
          console.log('pagedata222=', pagedata)
          subscribeList.value.push(obj)
        }
      }
    } else {
      finished.value = true
    }
    loading.value = false
    isLoading.value = false
    currpageNum.value = pagedata || '1'
    error.value = false
  }).catch(() => {
    loading.value = false
    isLoading.value = false
    error.value = true
  })
}
/**
* 滑到底部加载
*/
function onLoad() {
  console.log('currpageNum=', currpageNum.value)
  if (totalPageNum.value !== 0 && currpageNum.value === Number(totalPageNum.value)) {
    finished.value = true
  } else {
    const newPageNum = Number(currpageNum.value) + 1
    getData(newPageNum)
  }
  console.log('滑到底部加载')
}

/**
 * 跳转详情
*/
function gotoPage(url: string) {
  console.log('跳转详情页', url)
  router.push(url)
}
</script>

<style scoped lang="scss">
@import './index'
</style>
