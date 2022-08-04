<template>
  <div class="appointment-component">
    <!--标签选择-->
    <g-tabs v-model:current="currentTab" :data="tabData" @tabChange="tabChange">
      <!--按排班-->
      <template #frequency>
        <div class="time">
          <!--日期选择器-->
          <g-horizontal-scroller
            :current="currentTime"
            :data="dateArray"
            @tabChange="scrollerChange"
          />
        </div>
        <div class="doctor-list">
          <!--医生列表-->
          <g-doctor-item
            v-for="(item, index) in frequencyList"
            :key="index"
            :name="item.doctorName"
            :avatar="item.doctorPhoto"
            :gender="item.doctorSex"
            :desc="item.doctorSkill"
            :level="item.doctorTitle"
            :url="item.url"
            :price="item.medicalFee"
          >
          <!--日期排班、号源数列表-->
            <template #content>
              <div class="scheduling">
                <div v-if="item.timeRange.length > 0">
                  <div
                    v-for="(el, subIndex) in item.timeRange"
                    :key="subIndex"
                    class="item"
                    :class="{'disabled': item.scheduleStatusAry[subIndex] != '1' && item.scheduleStatusAry[subIndex] != '2'}"
                    @click.stop="popScheduling(item, subIndex, el)"
                  >
                    <div
                    v-if="item.scheduleStatusAry[subIndex] == '1' || item.scheduleStatusAry[subIndex] == '2'"
                  >
                  {{item.scheduleDate.substring(5,10)}} {{periodMap[el]}} {{ item.leftNumber[subIndex] }}
                    <svg-icon className="nav-icon" iconClass="icon-arrow" />
                  </div>
                  <div v-else>
                    {{item.scheduleDate.substring(5,10)}} {{ periodMap[el] }} {{scheduleStatusMap[item.scheduleStatusAry[subIndex]]}}
                  </div>
                  </div>
                </div>
              </div>
            </template>
          </g-doctor-item>
          <g-empty v-if="!frequencyList.length && !frequencyLoading"/>
        </div>
      </template>
      <!--按医生-->
      <template #doctor>
        <div class="doctor-list">
          <g-doctor-item
            v-for="(item, index) in doctorList"
            :key="index"
            :name="item.doctorName"
            :avatar="item.doctorPhoto"
            :gender="item.doctorSex"
            :desc="item.doctorSkill"
            :level="item.doctorTitle"
            :url="item.url"
            @click.native="handleDoctorClick(item)"
          />
        </div>
        <g-empty
          v-if="!doctorList.length && !doctorLoading"
          :image="defaultSchedule"
        />
      </template>
    </g-tabs>
    <!--号源弹窗-->
    <g-popup v-model:visible="popShow" :title="popTitle">
      <template #content>
        <div class="schedule-time">
          <div
            class="item"
            :class="classObject(item)"
            v-for="(item, index) in scheduleTime"
            :key="index"
            @click="selectScheduling(item)"
          >
            {{item.sourceTime}} ({{item.sourceNum}})
          </div>
        </div>
        <g-empty
          v-if="!scheduleTime.length && !popLoading"
          :image="defaultSchedule"
        />
      </template>
    </g-popup>
  </div>
</template>

<script lang="ts" setup>
import GTabs from '@/components/GTabs/index.vue'
import GHorizontalScroller from '@/components/GHorizontalScroller/index.vue'
import GDoctorItem from '@/components/GDoctorItem/index.vue'
import GPopup from '@/components/GPopup/index.vue'
import GEmpty from '@/components/GEmpty/index.vue'
import dayjs from 'dayjs'
import { querySourceCombinationList, queryDoctorAppointList, queryDoctorScheduleList } from '@/api/api'
import { gotoPage } from '@/utils/utils'
import { sortBy } from 'lodash-es'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import defaultSchedule from '@/assets/images/default-schedule.png'

const route = useRoute()
const router = useRouter()
const store = useStore()
const frequencyLoading = ref(true)
const doctorLoading = ref(true)
const popLoading = ref(true)
const currentTime = ref(dayjs().format('YYYY-MM-DD')) // 当前选择的时间
const currentTab = ref('frequency')
const tabData = reactive([
  {
    id: 'frequency',
    name: '按排班'
  },
  {
    id: 'doctor',
    name: '按医生'
  }
])
// 时段映射表
const periodMap: any = reactive({
  0: '全天',
  1: '上午',
  2: '下午'
})
// 排班状态
const scheduleStatusMap:any = {
  1: '正常可预约',
  2: '替诊可预约',
  3: '停诊',
  4: '停止预约',
  5: '已约满'
}
const frequencyList = ref<Array<any>>([]) // 排班数据
const currentSchedule: any = ref(null) // 当前选择的排班数据
const currentIndex: any = ref(null) //
const doctorList = ref<Array<any>>([])
const scheduling = ref<Array<any>>([])
const popShow = ref(false)
const popTitle =ref('')
const scheduleTime = ref<Array<any>>([])
const latest2weekScheduling= ref<Array<any>>([])
const sourceModel= ref('1')
const token = ref(route.query.token || store.getters['user/getUserToken'])
const businessCode = ref(route.query.businessCode)
const orgId = ref(route.query.orgId)
const hospitalName= ref(route.query.hospitalName)
const deptId= ref(route.query.deptId)
const deptName= ref(route.query.deptName)
const active= ref('') // 当前选择亮显
  
const dateArray = computed(() => {
const ary: Array<any> = []
const map = {
  0: '周天',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}
for (let i = 0; i < 15; i++) {
  let dayf = dayjs().add(i, 'day')
  ary.push({
    name: map[dayf.day()],
    id: dayf.format('MM-DD'),
    value: dayf.format('YYYY-MM-DD')
  })
}
return ary
})

function classObject(item: any) {
  return {
    active: active.value === item.sourceNoList[0],
    disable: item.sourceStatusList[0] !== '0'
  }
}

onMounted(() => {
  if (route.query.deptName) {
    document.title = route.query.deptName
  }
  getData()
})

/**
 * 初始化
 * 获取数据
 */
function getData() {
  if (currentTab.value === 'frequency') { // 按排班
    getFrequencyData()
  } else { // 按医生
    getDoctorData()
  }
}
/**
 * 获取按排班数据
 */
function getFrequencyData() {
  frequencyLoading.value = true

  const _params = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    deptId: deptId.value,
    startDate: currentTime.value,
    endDate: currentTime.value,
  }
  queryDoctorScheduleList(_params).then((res: any) => {
    const map:any = {}
    var data:any = {}
    // schedStatus 0有 1无 2已约满
    frequencyLoading.value = false
    res.forEach((item: any, index: number) => {
      res[index].schedule['doctorName'] = item.doctor.doctorName
      res[index].schedule['doctorSex'] = item.doctor.doctorSex
      res[index].schedule['doctorTitle'] = item.doctor.doctorTitle
      res[index].schedule['doctorPhoto'] = item.doctor.doctorPhoto
      res[index].schedule['doctorSkill'] = item.doctor.doctorSkill
      data[index] = res[index].schedule
    })
    data = sortBy(data, 'schedPeriod')

    for (const item of data) {
      if (!map[item.doctorId]) {
        item.timeRange = [item.schedulePeriod]
        item.leftNumber = [item.leftNum]
        item.schedIdAry = [item.scheduleId]
        item.schedPeriodAry = [item.schedulePeriod]
        item.scheduleStatusAry = [item.scheduleStatus]
        item.medicalFeeAry = [item.medicalFee]
        item.payTypeAry = [item.payType]
        map[item.doctorId] = item
        continue
      }

      map[item.doctorId].timeRange.push(item.schedulePeriod)
      map[item.doctorId].leftNumber.push(item.leftNum)
      map[item.doctorId].schedIdAry.push(item.scheduleId)
      map[item.doctorId].schedPeriodAry.push(item.schedulePeriod)
      map[item.doctorId].scheduleStatusAry.push(item.scheduleStatus)
      map[item.doctorId].medicalFeeAry.push(item.medicalFee)
      map[item.doctorId].payTypeAry.push(item.payType)
    }

    const ary = []

    for (const key in map) {
      ary.push(map[key])
    }
    frequencyList.value = ary
  }).catch(() => {
    frequencyLoading.value = false
  })
}
/**
 * 获取按医生数据
 */
function getDoctorData() {
  doctorLoading.value = true
  const _params = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    deptId: deptId.value
  }
  queryDoctorAppointList(_params).then((res: any) => {
    doctorList.value = res
    doctorLoading.value = false
  }).catch(() => {
    doctorLoading.value = false
  })
}
/**
 * 医生列表点击
 * @paramn item 信息块
 */
function handleDoctorClick(item: any) {
  const query = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    hospitalName: hospitalName.value,
    deptId: deptId.value,
    deptName: deptName.value,
    doctorId: item.doctorId
    // doctorName: item.doctorName,
    // doctorTitle: item.doctorTitle,
    // doctorSkill: item.doctorSkill,
    // doctorPhoto: item.doctorPhoto,
    // medicalFee: item.medicalFee,
    // doctorSex: item.doctorSex
  }
  router.push({
    path: '/doctorPage', 
    query: query
  })
}
/**
 * 弹起号源选择弹窗
 * @param e 当前点击的对象数据
 * @param index 当前索引
 */
function popScheduling(e, index, el) {
  if (e.scheduleStatusAry[index] !== '1' && e.scheduleStatusAry[index] !== '2') {
    return
  }
  popShow.value = true

  currentSchedule.value = e
  currentIndex.value = index
  popLoading.value = true
  const _params = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    deptId: deptId.value,
    doctorId: e.doctorId,
    schedulePeriod: e.schedPeriodAry[index],
    scheduleId: e.schedIdAry[index]
  }
  querySourceCombinationList(_params).then((res: any) => {
    popTitle.value = e.scheduleDate + ' ' + periodMap[e.schedPeriodAry[index]]
    scheduleTime.value = res
  })
}
/**
 * 选择号源
 * @param item 号源信息
 */
function selectScheduling(item: any) {
  if (item.sourceStatusList[0] !== '0') {
    return
  }
  active.value = item.sourceNoList[0]
  const query = {
    businessCode: businessCode.value,
    orgId: orgId.value,
    hospitalName: hospitalName.value,
    deptId: deptId.value,
    deptName: deptName.value,
    doctorId: currentSchedule.value.doctorId,
    doctorName: currentSchedule.value.doctorName,
    scheduleId: currentSchedule.value.schedIdAry[currentIndex.value],
    schedulePeriod: currentSchedule.value.schedPeriodAry[currentIndex.value],
    scheduleDate: currentSchedule.value.scheduleDate,
    sourceId: item.sourceIdList[0],
    sourceNo: item.sourceNoList[0],
    sourceTime: item.sourceTime,
    sourceTimeType: item.sourceTimeType,
    medicalFee: currentSchedule.value.medicalFeeAry[currentIndex.value],
    doctorSex: currentSchedule.value.doctorSex,
    payType: currentSchedule.value.payTypeAry[currentIndex.value] || 0,
    treatRoom: currentSchedule.value.treatRoom,
    treatRoomId: currentSchedule.value.treatRoomId
  }
  setTimeout(function() {
    router.push({
      path: '/reserveInformation',
      query: query
    })
  }, 300)
}
/**
 * 转化时间
 * @param time 需要转化的时间
 */
function transTime(time: any) {
  return dayjs(time).format('MM-DD')
}
function tabChange() {
  getData()
}
function scrollerChange(e: any) {
  currentTime.value = e.value
  getData()
}
function popLatest2weekScheduling(e: any) {
  popShow.value = true
  popTitle.value = '近两周号源'
  scheduleTime.value = e.latest2weekScheduling
}
</script>

<style scoped lang="scss">
  @import './index';
</style>
