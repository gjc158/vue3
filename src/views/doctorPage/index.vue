<template>
  <div class="doctor-page">
    <g-doctor-card
      :name="doctorName"
      :level="doctorTitle"
      :hospital="hospitalName"
      :department="deptName"
      :content="doctorContent"
      :hasFolder="hasFolder"
      :avatar="doctorPhoto"
      :gender='doctorSex'
    />
    <div
      v-if="isOutpatient"
      class="list-div"
    >
      <div
        v-for="(item, key) in dataSource"
        :key="key"
        class="flex-row-style list-row"
        :class="{ active: Number(item.scheduleStatus) === 1 || Number(item.scheduleStatus) === 2 }"
        @click="openDialog(item)"
      >
        <div>
          <div class="normal-text margin-bottom-style">
            {{ item.scheduleDate + ' ' + item.scheduleWeek + ' ' + periodMap[item.schedulePeriod] }}
          </div>
          <div class="flex-row-style">
            <div class="time-box">
              {{ getSpaceOfTime(item.scheduleDate) }}
            </div>
            <span
              v-if="item.medicalFee"
              class="normal-text smaller-font"
            >
              ¥{{ Number(item.medicalFee).toFixed(2) }}
            </span>
          </div>
        </div>
        <div class="status-style">
          {{ Number(item.scheduleStatus) === 1 || Number(item.scheduleStatus) === 2 ? '剩 ' + item.leftNum : scheduleStatusMap[item.scheduleStatus] }}
        </div>
      </div>
      <g-empty
        v-if="!dataSource.length && !loading"
        :image="noDataImg"
      />
    </div>
    <g-popup v-model:visible="popShow" :title="popTitle">
      <template #content>
        <div class="schedule-time">
          <div
            class="item"
            :class="classObject(item)"
            v-for="(item, index) in scheduleData"
            :key="index"
            @click="selectScheduling(item)"
          >
            {{item.sourceTime}} ({{item.sourceNum}})
          </div>
        </div>
      </template>
    </g-popup>
  </div>
</template>

<script lang="ts" setup>
import GDoctorCard from '@/components/GDoctorCard/index.vue'
import GPopup from '@/components/GPopup/index.vue'
import GEmpty from '@/components/GEmpty/index.vue'
import dayjs from 'dayjs'
import { queryScheduleList, querySourceCombinationList, queryDoctorAppointList } from '@/api/api'
import defaultSchedule from '@/assets/images/default-schedule.png'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const hasFolder = ref(true)
const regFee = ref('')
const isOutpatient = ref(true)
let loading = ref(true)
const doctorInfo: any = reactive({})
const doctorName = ref('')
const doctorTitle = ref('')
const doctorPhoto = ref('')
const doctorSex = ref('')
const queryParam: any = reactive({})
const hospitalName = ref(route.query.hospitalName || '')
const deptName = ref(route.query.deptName ||'')
// 时期映射表
const periodMap: any = {
  0: '全天',
  1: '上午',
  2: '下午'
}
// 排班状态
const scheduleStatusMap: any = {
  1: '正常可预约',
  2: '替诊可预约',
  3: '停诊',
  4: '停止预约',
  5: '已约满'
}
const dataSource: any = ref([])
let currentRow: any = ref(null) // 当前行
let popShow = ref(false)
let popTitle = ref('')
const scheduleData: any = ref([])
const noDataImg = defaultSchedule
let active = ref('') // 当前选择亮显

/**
 * 医生简介
 */
const doctorContent = computed(() => {
  if (!doctorInfo.doctorSkill) {
    return '暂无简介'
  }

  return doctorInfo.doctorSkill
})
/**
* 弹窗号源选择动态样式
*/
const classObject = computed(() => {
  return function(item: any) {
    return {
      active: active === item.sourceNoList[0],
      disable: item.sourceStatusList[0] !== '0'
    }
  }
})

onMounted(() => {
  queryParam.value = route.query
  getDoctorInfo()
  // doctorInfo = { ...$route.query }
})

function getDoctorInfo() {
  queryDoctorAppointList({
    doctorId: queryParam.value.doctorId,
    businessCode: queryParam.value.businessCode,
    orgId: queryParam.value.orgId,
    deptId: queryParam.value.deptId
  }).then((res: any) => {
    doctorInfo.value = res[0]
    console.info(doctorInfo)
    doctorName.value = res[0].doctorName
    doctorTitle.value = res[0].doctorTitle
    doctorPhoto.value = res[0].doctorPhoto
    doctorSex.value = res[0].doctorSex
    queryScheduleListFn()
  }).catch(err => {
    console.info(err)
  })
}

/**
 * 获取排班
 */
function queryScheduleListFn() {
  loading.value = true
  const startDate = dayjs().format('YYYY-MM-DD')
  const endDate = dayjs().add(14, 'day').format('YYYY-MM-DD')
  const _params = {
    businessCode: queryParam.value.businessCode,
    orgId: queryParam.value.orgId,
    deptId: queryParam.value.deptId,
    doctorId: queryParam.value.doctorId,
    startDate: startDate,
    endDate: endDate
  }
  queryScheduleList(_params).then((res: any) => {
    loading.value = false
    dataSource.value = res
  }).catch(() => {
    loading.value = false
  })
}

/**
 * 打开选择号源弹窗
 * @param item 数据块
 */
function openDialog(item: any) {
  if (Number(item.scheduleStatus) !== 1 && Number(item.scheduleStatus) !== 2) {
    return
  }

  currentRow.value = item
  const _params = {
    businessCode: queryParam.value.businessCode,
    orgId: queryParam.value.orgId,
    deptId: queryParam.value.deptId,
    doctorId: queryParam.value.doctorId,
    schedulePeriod: item.schedulePeriod,
    scheduleId: item.scheduleId
  }
  querySourceCombinationList(_params).then((res: any) => {
    popShow.value = true
    popTitle.value = item.scheduleDate + ' ' + periodMap[item.schedulePeriod]
    scheduleData.value = res
  })
}

/**
 * 选择号源
 */
function selectScheduling(item: any) {
  if (item.sourceStatusList[0] !== '0') {
    return
  }
  active = item.sourceNoList
  const query = {
    businessCode: queryParam.value.businessCode,
    orgId: doctorInfo.value.orgId,
    hospitalName: queryParam.value.hospitalName,
    deptId: queryParam.value.deptId,
    deptName: queryParam.value.deptName,
    doctorId: doctorInfo.value.doctorId,
    doctorName: doctorInfo.value.doctorName,
    scheduleId: currentRow.value.scheduleId,
    schedulePeriod: currentRow.value.schedulePeriod,
    scheduleDate: currentRow.value.scheduleDate,
    sourceId: item.sourceIdList[0],
    sourceNo: item.sourceNoList[0],
    sourceTime: item.sourceTime,
    sourceTimeType: item.sourceTimeType,
    medicalFee: currentRow.value.medicalFee,
    doctorSex: doctorInfo.value.doctorSex,
    payType: currentRow.value.payType || 0,
    treatRoom: currentRow.value.treatRoom,
    treatRoomId: currentRow.value.treatRoomId
  }
  setTimeout(function() {
    router.push({
      path: '/reserveInformation',
      query: query
    })
  }, 300)
}

/**
 * 获取时间间隔
 * @param time 需要计算的时间
 */
function getSpaceOfTime(time: any) {
  const nowStr = dayjs().format('YYYY-MM-DD')
  const space = dayjs(time).diff(dayjs(nowStr), 'day')
  if (space === 0) {
    return '今天'
  } else if (space === 1) {
    return '明天'
  } else {
    return space + '天后'
  }
}
</script>

<style scoped lang="scss">
@import './index';
</style>
