<template>
  <div class="reserve-information">
    <div class="head-div">
      <div class="bg">
        <div class="title">温馨提示</div>
        <div class="tips">
          请持有效证件前往医院就诊，为避免交叉感染，减少患者在院停留时间，请按照预约时间段来院就诊。
        </div>
      </div>
    </div>
    <g-info-card
      :title="doctorName"
      :avatar="imgUrl"
      :data="dataSource"
      :gender="doctorSex"
    >
      <template #default="scope">
        <div
          :style="{ color: scope.data.color }"
          class="slot-style"
        >
          {{ getValue(scope.data) }}
        </div>
      </template>
    </g-info-card>
    <g-list-card :data="list">
      <template #default="scope">
        <div class="slot-style" @click="judgeSelect(scope.data)">
          <input
            v-if="scope.data.edit"
            type="text"
            v-model="scope.data.value"
            class="edit-input"
          />
          <span v-else>{{ scope.data.value }}</span>
          <svg-icon
            v-if="scope.data.iconLeft"
            className="icon-left-style"
            iconClass="icon-arrow"
          />
        </div>
      </template>
    </g-list-card>
    <g-fill />
    <div class="info-div fourth-div">
      <van-button
        type="primary"
        :loading="isloading"
        size="large"
        @click="handleBook"
      >
        确认预约
      </van-button>
    </div>
    <div class="popPage">
      <g-popup v-model:visible="personShow" :title="personTitle">
        <template #content>
          <div
            class="item"
            v-for="(item, index) in userList"
            :key="index"
            @click="userCheck(item)"
          >
            <div
              class="name"
              :class="currentUserId == item.userId ? 'active' : ''"
            >
              {{ item.name }}
            </div>
            <img
              :src="iconChecked"
              alt=""
              class="icon-checked"
              v-if="currentUserId == item.userId"
            />
          </div>
        </template>
      </g-popup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import GInfoCard from '@/components/GInfoCard/index.vue'
import GListCard from '@/components/GListCard/index.vue'
import GFill from '@/components/GFill/index.vue'
import GPopup from '@/components/GPopup/index.vue'
import {
  getUserCache,
  appoint,
  lockSource,
  payRecharge,
  appointConfirm,
  getRecordList
} from '@/api/api'
import { desensitization, gotoPage } from '@/utils/utils'
import iconChecked from '@/assets/images/icon-checked.png'
import { useRoute, useRouter} from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userList: any = ref([])
const personShow = ref(false)
const personTitle = ref('请选择就诊人')
const currentUserId = ref('')
const doctorInfo = reactive(route.query) // 医生信息
const doctorName = ref(route.query.doctorName || '')
const imgUrl = ref(route.query.imgUrl || '')
const doctorSex = ref(route.query.doctorSex || '')
const doctorId = ref('')
const isloading = ref(false)
const dataSource = reactive([
  {
    name: '就诊医院',
    id: 'hospitalName',
    value: route.query.hospitalName
  },
  {
    id: 'departName',
    name: '就诊科室',
    value: route.query.deptName
  },
  {
    name: '就诊时间',
    value:
      route.query.scheduleDate + ' ' + route.query.sourceTime,
    color: '#3186FF'
  },
  {
    id: 'fees',
    value: route.query.medicalFee
      ? route.query.medicalFee + ' 元'
      : '线下确认',
    name: '医事服务费'
  }
])
let list: any = reactive([
  {
    id: 'name',
    name: '就诊人',
    iconLeft: true
  },
  {
    id: 'phone',
    name: '手机号'
    // edit: true
  },
  {
    id: 'idNo',
    name: '证件号'
  }
])
const popShow = ref(false)
const currentCard: any = reactive({})
const doctorAppoint = ref('') // 操作端标志 0-患者端  1-医生端
const idNo = ref('')
const transferInfo = ref(null)
localStorage.removeItem('commonData')
  
onMounted(() => {
  console.log('route.query', route.query)
  console.log('doctorInfo', doctorInfo)
  init()
})
/**
 * 获取值
 * @param val 插槽数据
 */
function getValue(val: any) {
  if (val.value) {
    return val.value
  }
  return doctorInfo.value?[val.id] : ''
}

/**
 * 初始化
 * 获取用户信息
 */
function init() {
  getUserCache({
    token: store.getters['user/getUserToken']
  })
    .then((res: any) => {
      console.info(res)
      initField(res)
      doctorAppoint.value = res.doctorAppoint
      idNo.value = res.idNo
      currentUserId.value = res.accountInfo.currentUserId
      if (res.accountInfo && res.accountInfo.authStatus !== '01') {
        // 未实名 todo
      } else {
        setUserList(res)
      }
      // transferInfo = res.transferInfo
    })
    .catch((err) => {
      console.info(err)
    })
}

function setUserList(res: any) {
  const arr = []
  arr.push(res.userInfo)
  if (res.userRelationDTOS && res.userRelationDTOS.length > 0) {
    for (let i = 0; i < res.userRelationDTOS.length; i++) {
      arr.push(res.userRelationDTOS[i].familyUserInfo)
    }
  }
  userList.value = arr
  const current = arr.filter(item => {
    return item.userId === currentUserId.value
  })
  currentCard.value = current[0] || res.userInfo
  userCheck(currentCard.value)
  console.info(arr)
}

/**
 * 初始化展示字段
 */
function initField(res: any) {
  if (res.accountInfo && res.accountInfo.authStatus !== '01') {
    // 未实名 只展示手机号码
    list = [{
      id: 'phone',
      name: '手机号'
      // edit: true
    }]
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === 'name') {
      list[i].value = desensitization(res.userInfo.name)
    }
    if (list[i].id === 'idNo') {
      list[i].value = desensitization(res.userInfo.idNo)
    }
    if (list[i].id === 'phone') {
      list[i].value = res.accountInfo.username
    }
  }
  console.log('list=', list)
}

/**
 * 点击预约按钮
 * payType,支付类型 0-无需支付 -1线上支付 2-线下支付
 */
function handleBook() {
  if (doctorInfo.payType && doctorInfo.payType === '1') {
    // Toast({
    //   message: '暂时不支持线上支付，敬请期待'
    // })
    // return false
    isloading.value = true
    lockSourceFn()
  } else {
    appointFn()
  }
}
/**
 * 锁号(支付类型为线上支付调用)
 */
function lockSourceFn() {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === 'phone') {
      doctorInfo.phone = list[i].value
      break
    }
  }
  doctorInfo.channelType = '1'
  doctorInfo.treatUserId = currentUserId.value
  console.log('route=', doctorInfo)

  lockSource(doctorInfo)
    .then((res: any) => {
      payRechargeFn(res.recordId)
    })
    .catch((err) => {
      console.log('预约结果err=', err)
      setTimeout(() => {
        router.push({
          path: '/bookingResult',
          query: {
            result: 'fail',
            resMsg: err.respMsg,
            orgId: doctorInfo.orgId,
            deptId: doctorInfo.deptId,
            deptName: doctorInfo.deptName,
            hospitalName: doctorInfo.hospitalName,
            businessCode: doctorInfo.businessCode
          }
        })
      }, 150)
    })
}

function payRechargeFn(recordId: any) {
  payRecharge({
    orgId: doctorInfo.orgId,
    recordId: recordId
  }).then((res: any) => {
    // if (parseInt(res.rechargeMoney) === 0) {
    //   // 0元直接跳转成功页
    //   gotoPage.call(this, '/phyExambookingResult', {
    //     result: 'success',
    //     orgId: hospInfo.orgId,
    //     hospitalName: hospInfo.hospitalName,
    //     id: res.recordId,
    //     amount: '0',
    //     scheduleDate: hospInfo.scheduleDate
    //   })
    //   return false
    // }
    // 1.组装支付数据为以下格式
    const orderInfo = {
      'extra': {
        'amount': doctorInfo.medicalFee, // 金额，小程序收银台展示
        'returnUrl': window.YHSERVICECONFIG.base + 'yh-ep-appointment-front/#/bookingResult?result=success&id=' + recordId +
            '&orgId=' + doctorInfo.orgId +
            '&deptId=' + doctorInfo.deptId +
            '&deptName=' + doctorInfo.deptName +
            '&hospitalName=' + doctorInfo.hospitalName +
            '&businessCode=' + doctorInfo.businessCode +
            '&status=6'
        // 支付成功回调地址，支付成功跳转地址
      },
      'credential': res.payParamVO.credential
    }
    // 2.进行序列化、encode处理
    const params = encodeURIComponent(JSON.stringify(orderInfo))
    console.log('请求小程序支付', orderInfo)
    // 3.携带参数并且跳转
    wx.miniProgram.getEnv((res: any) => {
      if (res.miniprogram) {
        wx.miniProgram.navigateTo({
          url: `/pages/cashier/index?urlParam=${params}`
        })
      }
    })
  })
}

/**
 * 确认预约(锁号无需支付时调用)
 */
async function appointConfirmFn(recordId: any, status: any) {
  await getRecordList({
    orgId: doctorInfo.orgId,
    status: status,
    recordId: recordId
  }).then((data: any) => {
    appointConfirm({
      orgId: doctorInfo.orgId,
      recordId: recordId,
      idType: data.idType,
      idNo: data.idNo,
      cardType: data.cardType,
      cardNo: data.cardNo
    })
      .then((res: any) => {
        isloading.value = false
        console.log('预约结果success=', res)
        clearTempData() // 清空转诊暂存数据
        router.push({
          path: '/bookingResult',
          query: {
            result: 'success',
            id: res.recordId,
            status: res.status,
            orgId: doctorInfo.orgId,
            deptId: doctorInfo.deptId,
            deptName: doctorInfo.deptName,
            hospitalName: doctorInfo.hospitalName,
            businessCode: doctorInfo.businessCode
          }
        })
      })
      .catch((err) => {
        console.log('预约结果err=', err)
        setTimeout(() => {
          router.push({
            path: '/bookingResult',
            query:  {
              result: 'fail',
              resMsg: err.respMsg,
              orgId: doctorInfo.orgId,
              deptId: doctorInfo.deptId,
              deptName: doctorInfo.deptName,
              hospitalName: doctorInfo.hospitalName,
              businessCode: doctorInfo.businessCode
            }
          })
        }, 150)
      })
  })
}

/**
 * 点击预约
 */
function appointFn() {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === 'phone') {
      route.query.phone = list[i].value
      break
    }
  }
  route.query.channelType = '1'
  console.log('route=', route.query)
  router.push({
    path: '/bookingResult',
    query: {
      result: 'success',
      id: "1555078120866873346",
      status: "1",
      orgId: route.query.orgId,
      deptId: doctorInfo.deptId,
      deptName: doctorInfo.deptName,
      hospitalName: route.query.hospitalName,
      businessCode: route.query.businessCode,
      doctorAppoint: doctorAppoint.value
    }
  })
  return 
  appoint({
    ...route.query,
    totalFee: route.query.medicalFee,
    treatUserId: currentUserId.value
    // transferInfo: transferInfo || undefined
  })
    .then((res: any) => {
      clearTempData() // 清空转诊暂存数据
      router.push({
        path: '/bookingResult',
        query: {
          result: 'success',
          id: res.recordId,
          status: res.status,
          orgId: route.query.orgId,
          deptId: doctorInfo.deptId,
          deptName: doctorInfo.deptName,
          hospitalName: route.query.hospitalName,
          businessCode: route.query.businessCode,
          doctorAppoint: doctorAppoint.value
        }
      })
    })
    .catch((err) => {
      console.log('err=', err)
      if (err.respCode === '070199') {
        return false
      }
      setTimeout(() => {
        router.push({
          path: '/bookingResult',
          query: {
            result: 'fail',
            resMsg: err.respMsg,
            orgId: route.query.orgId,
            deptId: doctorInfo.deptId,
            deptName: doctorInfo.deptName,
            hospitalName: route.query.hospitalName,
            businessCode: route.query.businessCode,
            doctorAppoint: doctorAppoint.value
          }
        })
      }, 150)
    })
}

/**
 * 清空暂存数据
 */
function clearTempData() {
  store.dispatch('appointment/setAppointData', { id: idNo.value })
}

function judgeSelect(item: any) {
  if (item.iconLeft) {
    personShow.value = true
  }
  return false
}

function userCheck(item: any) {
  currentUserId.value = item.userId
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === 'name') {
      list[i].value = desensitization(item.name)
    }
    if (list[i].id === 'idNo') {
      list[i].value = desensitization(item.idNo)
    }
  }
  personShow.value = false
}

</script>

<style scoped lang="scss">
@import './index';
</style>
