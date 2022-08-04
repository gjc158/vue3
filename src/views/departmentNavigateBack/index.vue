<!--科室介绍-->
<template>
  <div class="departmentBack-navigate">
    <div class="g-gray-fill-heigh" ></div>
    <div class="department-content" v-if="navList.length || loading">
      <!--左侧导航-->
      <van-tree-select height="98vh" :items="navList" v-model:main-active-index="active" @click-nav="getDataSourceTwo">
        <!--右侧内容-->
        <template #content>
          <div class="right-list" v-if="currentList.length || loading">
            <div
              class="right-item"
              v-for="(item, index) in currentList"
              :key="index"
              @click="gotoPage(item)"
            >
            {{ item.deptName}}
              <!-- <svg-icon
                className="icon-left-style right"
                iconClass="icon-arrow"
              /> -->
            </div>
          </div>
        </template>
      </van-tree-select>
    </div>
    <g-empty v-else :image="emptyImg"></g-empty>
  </div>
</template>

<script lang="ts" setup>
import { queryDeptAppointList, getUserCache, getHospitalList } from '@/api/api'
import GEmpty from '@/components/GEmpty/index.vue'
import emptyImg from'@/assets/images/default-search.png'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const active = ref(0)
const popShow = ref(false)
const isLoading = ref(false)
const queryName = ref('') // 搜索科室
let currentItem = reactive({
  deptName: '',
  deptCode: '',
  deptStatus: ''
}) // 当前点击对象
const navList = ref<any[]>([])
const isOutPatient = ref('')
const currentList = ref<any[]>([])
const medicalId = ref('')
const loading = ref(true)
const token = ref(route.query.token || store.getters['user/getUserToken'])
const businessCode = ref(route.query.businessCode)
const orgId = ref(route.query.orgId)
const hospitalName = ref(route.query.hospitalName,)
const standardDept = ref(route.query.standardDept || '')
const title = computed(() => {
  return currentItem?.deptName || ''
})

onMounted(() => {
if (route.query.businessCode) {
    getDataSource()
  } else {
    getUserCacheFn()
  }
})

  /**
  * 获取业务类型
  */
function getUserCacheFn() {
  isLoading.value = true
  getUserCache({
    token: token.value
  }).then((res: any) => {
    console.info(res)
    businessCode.value = res.businessCode || '00'
    getHospitalListFn()
  }).catch(err => {
    console.info(err)
    isLoading.value = false
  })
}

/**
* 获取医院信息
*/
function getHospitalListFn() {
  isLoading.value = true
  getHospitalList({
    businessCode: businessCode.value,
    orgId: orgId.value
  }).then((res: any) => {
    console.info(res)
    hospitalName.value = res.hospitalName || ''
    getDataSource()
  }).catch(err => {
    console.info(err)
    isLoading.value = false
  })
}
  /**
   * 获取一级科室
   * deptLevel 1 一级科室，2 二级科室
   */
function getDataSource() {
  loading.value = true
  const params = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    deptLevel: '1',
    standardDept: standardDept.value
  }
  queryDeptAppointList(params).then((res: any) => {
    console.log('res=', res)
    if (res.length > 0) {
      res.forEach((item: any) => {
        navList.value.push({
          text: item.deptName,
          deptId: item.deptId
        })
      })
      getDataSourceTwo(navList.value[0].deptId)
    }
    loading.value = false
  })
}
  /**
   * 获取二级科室
   * deptLevel 1 一级科室，2 二级科室
   */
async function getDataSourceTwo(data: any) {
  await nextTick(()=>{
    // console.info(active.value)
  })
  currentList.value = []
  loading.value = true
  const params = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    deptLevel: '2',
    upperDeptId: navList.value[active.value].deptId
  }
  queryDeptAppointList(params).then((res: any) => {
    // console.log('res=', res)
    if (res.length > 0) {
      currentList.value = res
    } else {
      gotoPage(navList.value[active.value])
    }
    loading.value = false
  })
}
  /**
   * 设置当前点击数据块
   * @param item 数据块
   */
function setCurrentItem(item: any) {
  console.log('当前选中=', item)
  currentItem = item
  getDataSource()
}
/**
* 跳转
*/
function gotoPage(item: any) {
  router.push({
    path: '/appointment',
    query: {
      businessCode: businessCode.value,
      orgId: orgId.value,
      hospitalName: hospitalName.value,
      deptId: item.deptId,
      deptName: item.deptName
    }
  })
}
</script>

<style scoped lang="scss">
  @import "./index";
</style>
