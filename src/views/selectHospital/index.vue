<!--选择医院-->
<template>
  <div class="select-hospital">
    <!--搜索栏-->
    <van-sticky>
      <div class="select-hospital__header">
        <g-search
          v-model:value="form.hospitalName"
          placeholder="请输入医院名称搜索"
          @search="search"
        />
      </div>
    </van-sticky>
    <!-- 筛选、排序 -->
    <div class="filter-box">
      <div class="filter-item">
        <w-picker
          v-model:value="display.hospitalTypeName"
          typeName="hospitalTypeName"
          placeholder="选择分类"
          @click="openPicker"
        />
      </div>
      <div class="filter-item filter-item-middle">
        <w-picker
          v-model:value="display.areaName"
          typeName="areaName"
          placeholder="选择地区"
          @click="openPicker"
        />
      </div>
      <div class="filter-item">
        <div
          class="filter-item-text"
          :class="{'active': showDistanceHos }"
          @click="setDistanceFilter"
        >
          离我最近
        </div>
      </div>
    </div>
    <!--标签栏-->
    <van-tabs v-model="hospitalType" v-if="tabshow" @change="handleChange">
      <van-tab title="区属医院" name="1">
        <tabs-item
          :hospitalList="hospitalList"
          v-model:finished="finished"
          v-model:error="error"
          v-model:isLoading="isLoading"
          @onLoad="onLoad"
          @gotoPage="gotoPage"
        >
        </tabs-item>
      </van-tab>
      <van-tab title="社区卫生服务中心" name="2">
        <tabs-item
          :hospitalList="hospitalList"
          v-model:finished="finished"
          v-model:error="error"
          v-model:isLoading="isLoading"
          @onLoad="onLoad"
          @gotoPage="gotoPage"
        >
        </tabs-item>
      </van-tab>
    </van-tabs>
    <!--无标签栏 列表-->
    <div v-if="!tabshow" class="select-hospital__body">
      <tabs-item
        :hospitalList="hospitalList"
        v-model:finished="finished"
        v-model:error="error"
        v-model:isLoading="isLoading"
        @onLoad="onLoad"
        @gotoPage="gotoPage"
      >
      </tabs-item>
    </div>
    <g-pop-select v-model:visible="showDialog" v-model:data="popList" @confirm="confirm"> </g-pop-select>

  </div>
</template>

<script lang="ts" setup>
import GPopSelect from 'comps/GPopSelect/index.vue'
import GSearch from 'comps/GSearch/index.vue'
import TabsItem from './components/TabsItem.vue'
import { queryHospitalPage, getHospitalList, getUserCache, getDictList, getAreaDictList } from '@/api/api'
import WPicker from './components/WPicker.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()
// 单院的增加参数merchId=医院id
// 页面默认不显示tab，增加入参hasTab=1
const totalPageNum = ref('') // 总页数
const currpageNum = ref('1') // 当前页数
const tabshow = ref(false) // 是否有标签栏 默认不显示tab
const hospitalType = ref('') // 当前选中标签,0,1
const isLoading = ref(true)
const hospitalList = ref([])
const token = ref(route.query.token || store.getters['user/getUserToken'] || '') // 用户缓存token
const finished = ref(false)
const error = ref(false)
const form = reactive({
  businessCode: '00',
  hospitalName: '',
  area: '',
  hospitalType: '',
  sortRule: '',
  longitude: '',
  latitude: '',
  pageNumber: '1',
  pageSize: 10
})
const display = reactive({
  areaName: '',
  hospitalTypeName: ''
})
let areaList:any = ref([{ code: '', name: '全部' }])
let hospitalTypeList:any = ref([{ id: '', name: '全部' }])
const showDistanceHos = ref(false)
const type = ref('')
const showDialog = ref(false)
let popList:any = ref([])
const popType = ref('')
toRefs(form)
toRefs(display)
toRefs(areaList)
toRefs(popList)

onMounted(() => {
  // 24.486405,118.177888 纬度、经度

  if (route.query.hasTab === '1') {
    tabshow.value = true
    hospitalType.value = '0'
  }
  const latitude:any = route.query.latitude || ''
  const longitude:any = route.query.longitude || ''
  form.longitude = longitude
  form.latitude = latitude
  getUserCacheKey()
  getAreaList()
  getHospitalTypeList()
  getHospitalListFun('')
})

/**
 * 获取业务类型
 */
function getUserCacheKey() {
  isLoading.value = true
  getUserCache({
    token: token.value
  }).then((res: any) => {
    console.info(res)
    // businessCode = res.businessCode || '00'
    form.businessCode = res.businessCode || '00'
    getHospitalListFun('')
  })
  .catch((err: any) => {
    console.info(err)
    isLoading.value = false
  })
}

/**
 * 获取数据
 */
function getHospitalListFun(pagedata: string) {
  isLoading.value = true
  const param = Object.assign({}, form, {
    pageNumber: pagedata || '1'
  })
  console.info(param)
  queryHospitalPage(param)
    .then((res: any) => {
      console.log('res=', res)
      totalPageNum.value = res.totalElements // 总数
      if (pagedata) {
        hospitalList.value = hospitalList.value.concat(res.content)
      } else {
        hospitalList.value = res.content
        if(hospitalList.value.length < param.pageSize){
          finished.value = true
        }
      }
      isLoading.value = false
      currpageNum.value = pagedata || '1'
      error.value = false
    })
    .catch(() => {
      isLoading.value = false
      error.value = true
    })
}
/**
 * 搜索框查询
 */
function search() {
  hospitalList.value = []
  isLoading.value = true
  getHospitalListFun('')
}
/**
 * 跳转
 */
function gotoPage(item: any) {
  router.push({
    // path: '/departmentNavigate',
    path: '/departmentNavigateBack',
    query: {
      businessCode: form.businessCode,
      orgId: item.orgId,
      hospitalName: item.hospitalName
    }
  })
}
/**
 * 滑到底部加载
 */
function onLoad() {
  console.log('currpageNum=', currpageNum)
  if (
    totalPageNum.value !== '' &&
    hospitalList.value.length === Number(totalPageNum.value)
  ) {
    finished.value = true
    console.info('finish')
  } else {
    const newPageNum = Number(currpageNum.value) + 1
    getHospitalListFun(newPageNum+'')
  }
  console.log('滑到底部加载')
}
  /**
   * tab 切换
   */
function handleChange(val: any) {
  console.log('val==', hospitalType)
  hospitalList.value = []
  getHospitalListFun('')
}

function setDistanceFilter() {
  showDistanceHos.value = !showDistanceHos.value
  form.sortRule = showDistanceHos.value ? '2' : '1'
  getHospitalListFun('')
}

function openPicker(type: any) {
  debugger
  showDialog.value = true
  popType.value = type
  if (type === 'hospitalTypeName') {
    popList.value = hospitalTypeList.value
  } else if (type === 'areaName') {
    popList.value = areaList.value
  }
  console.info(popList)
}

function confirm(index: any) {
  if (popType.value === 'hospitalTypeName') {
    // 类别筛查
    const _item = hospitalTypeList.value[index]
    form.hospitalType = _item.id
    display.hospitalTypeName = _item.name
  } else if (popType.value === 'areaName') {
    // 地区筛查
    const _item = areaList.value[index]
    form.area = _item.code
    display.areaName = _item.name
  }
  getHospitalListFun('')
}
  // 获取地区列表
function getAreaList() {
  getAreaDictList({
    upperCode: '440900000000'
  }).then((res: any) => {
    const _data = res || []
    console.info(_data)
    areaList.value = areaList.value.concat(_data)
    console.info(areaList)
  })
}
  // 获取医院类别列表
function getHospitalTypeList() {
  getDictList({
    code: 'hospital_type'
  }).then((res: any) => {
    const _data = res || []
    hospitalTypeList.value = hospitalTypeList.value.concat(_data)
  })
}

</script>

<style lang="scss" scoped>
@import './index';
</style>
