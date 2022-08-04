<template>
  <div class="subscribe-detail">
    <!--预约的医院-->
    <div class="hospital-item">
      <!--医院头像-->
      <div class="hospital-item__img">
        <img src="@/assets/images/hospital-default.png" alt="" />
      </div>
      <!--医院名称、地址-->
      <div class="hospital-item__content">
        <span class="hospital-item__title">{{ hosInfo.hospitalName }}</span>
        <span class="hospital-item__desc">{{ hosInfo.address }}</span>
      </div>
      <!--医院级别-->
      <div class="hospital-item__">
        <span class="hospital-item__tags">
          <span v-if="hospLevel" class="tag">{{ hospLevel }}</span>
        </span>
      </div>
    </div>
    <!--预约信息-->
    <g-info-card :data="subList" :hasAvatar="false" />
    <g-list-card :data="subDetailList">
      <template #default="scope: any">
        <div class="slot-style">
          <span class="normal-text">{{ scope.data.value }}</span>
        </div>
      </template>
    </g-list-card>
    <!-- 支付信息 -->
    <g-list-card :data="payList">
      <template #default="scope: any">
        <div class="slot-style">
          <span class="normal-text">{{ scope.data.value }}</span>
        </div>
      </template>
    </g-list-card>
    <!-- 转诊信息 -->
    <g-info-card
      v-if="info && info.transferInfo"
      title="病情情况"
      :data="transferInfoList"
      break-line
      :hasAvatar="false"
      small-title
    >
    </g-info-card>
    <g-fill />
    <div class="g-fix-bottom-btn" v-if=" info.status !== '2'">
      <div class="btn-container" v-if="info.status === '6' && info.payType === '1'">
        <van-button type="primary" @click="goPay()">
            去支付
        </van-button>
        <van-button plain type="primary" @click="cancelLock">
          取消预约
        </van-button>
      </div>
      <div v-else-if="info.status === '1'">
        <div class="btn-container" v-if="showSignFlag">
          <van-button type="primary" @click="gotoSign">
            去签到
          </van-button>
          <van-button plain type="primary" @click="cancelSubscribe">
            取消预约
          </van-button>
        </div>
        <van-button
          plain
          type="primary"
          size="large"
          v-else
          @click="cancelSubscribe"
        >
          取消预约
        </van-button>
      </div>
      <van-button
        type="primary"
        size="large"
        v-else-if="info.status !== '1' && !unReset"
        @click="resetSubscribe"
        >重新预约</van-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Dialog, Toast } from 'vant'
import GInfoCard from '@/components/GInfoCard/index.vue'
import GListCard from '@/components/GListCard/index.vue'
import GFill from '@/components/GFill/index.vue'
import {
  getRecordList,
  cancelAppoint,
  getHospitalList,
  getUserCache,
  payRecharge,
  releaseSource
} from '@/api/api'
import {
  gotoPage,
  desensitization,
  orderStatusFmt,
  payTypeFmt
} from '@/utils/utils'
import { HOSPITAL_LEVEL } from '@/utils/constant'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()
const isLoading = ref(true)
let subList: any = ref([])
let subDetailList: any = ref([])
let payList: any = ref([])
let transferInfoList: any = ref([])
let info: any = reactive({ 
  status: '2',
  transferInfo: '',
  payType: '',
  scheduleDate: ''
})
let tempInfo: any = {}
const hosInfo = reactive({
  hospitalName: '',
  address: '',
  hospitalLevel: '',
  needSign: ''
}) // 医院信息列表
const token = ref(route.query.token || store.getters['user/getUserToken'])
const businessCode = ref(route.query.businessCode)
const id = ref(route.query.recordId)
const idNo = ref(route.query.idNo)
const doctorAppoint = ref('') // 操作端标志 0-患者端（不可重新预约） 1-医生端
const unReset = ref(false) // 转诊的 患者端 不允许重新预约
const isWxMini =  ref(false)
/**
 * 医院等级字典匹配
 */
const hospLevel = computed(() => {
  return hosInfo.hospitalLevel ? HOSPITAL_LEVEL[hosInfo.hospitalLevel] : ''
})

const showSignFlag = computed(() =>{
  // 是否显示签到
  if (
    hosInfo.needSign === '1' &&
    info.status === '1' &&
    info.scheduleDate &&
    dayjs().format('YYYY-MM-DD') === info.scheduleDate
  ) {
    return true
  } else {
    return false
  }
})
onMounted(() => {
  isWxMini.value = false
  wx.miniProgram.getEnv((res: any) => {
    console.log(res.miniprogram) // true
    isWxMini.value = res.miniprogram
  })
  getUserCacheFn()
})
/**
 * 获取患者端医生端标识
 */
function getUserCacheFn() {
  isLoading.value = true
  getUserCache({
    token: token.value
  })
    .then((res: any) => {
      console.info(res)
      doctorAppoint.value = res.doctorAppoint
      getData()
    })
    .catch((err) => {
      isLoading.value = false
      console.info(err)
    })
}
/**
 * 获取预约数据
 */
function getData() {
  getRecordList({
    recordId: id.value
  }).then((res: any) => {
    console.log(res)
    info.status = res[0].status
    info.transferInfo = res[0].transferInfo
    info.payType = res[0].payType
    info.scheduleDate =  res[0].scheduleDate
    tempInfo = res[0]
    getHospitalListFn(tempInfo.orgId)
    let color = '#999'
    switch (parseInt(tempInfo.status)) {
      case 1:
        color = '#3186FF'
        break
      case 2:
        color = '#1BBE6D'
        break
      case 6:
        color = '#3186FF'
        break
      case 9:
        color = '#FF9D0B'
        break
      default:
        color = '#999'
    }
    subList.value = [
      {
        name: '就诊科室',
        value: tempInfo.deptName
      },
      {
        name: '诊室名称',
        value: tempInfo.treatRoom
      },
      {
        name: '就诊医师',
        value: tempInfo.doctorName
      },
      {
        name: '就诊时间',
        value: tempInfo.scheduleDate + ' ' + tempInfo.sourceTime
      },
      {
        name: '医事服务费',
        value: tempInfo.medicalFee
          ? tempInfo.medicalFee + ' 元'
          : '线下确认'
      },
      {
        name: '就诊状态',
        value: orderStatusFmt(tempInfo.status),
        color: color
      }
    ]
    if (!tempInfo.treatRoom) {
      subList.value.splice(1, 1)
    }
    console.log('subList=', subList)
    if (tempInfo.name) {
      subDetailList.value = [
        {
          name: '就诊人',
          value: desensitization(tempInfo.name)
        },
        {
          name: '手机号',
          value: desensitization(tempInfo.phone)
        },
        {
          name: '证件号',
          value: desensitization(tempInfo.idNo)
        }
      ]
    } else {
      subDetailList.value = [
        {
          name: '手机号',
          value: desensitization(tempInfo.phone)
        }
      ]
    }

    // 转诊
    if (tempInfo.transferInfo) {
      if (Number(doctorAppoint.value) === 0) {
        // 转诊的 患者端 不允许重新预约
        unReset.value = true
      }
      const transferInfo = tempInfo.transferInfo
      transferInfoList.value = [
        {
          name: '初步印象',
          value: transferInfo.firstJudge
        },
        {
          name: '主要现病史',
          value: transferInfo.nowCase
        },
        {
          name: '主要既往史',
          value: transferInfo.pastCase
        },
        {
          name: '诊疗经过及下一步诊疗方案',
          value: transferInfo.treatAndPlan
        }
      ]
    }
    // 支付
    if (tempInfo.payType === '1') {
      const payRecordDTO = tempInfo.payRecordDTO
      payList.value = [
        {
          name: '支付状态',
          value: payTypeFmt(payRecordDTO.payStatus)
        },
        {
          name: '支付金额',
          value: (payRecordDTO.totalFee || 0) + '元'
        },
        {
          name: '支付时间',
          value: dayjs(payRecordDTO.payTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          name: '订单号',
          value: payRecordDTO.payRecordId
        }
      ]
    }
  })
}
/**
 * 获取医院数据
 */
function getHospitalListFn(orgId: string | number) {
  let param: any = {
    businessCode: businessCode.value,
    orgId: orgId
  }
  getHospitalList(param).then((res: any) => {
    hosInfo.hospitalName = res[0].hospitalName
    hosInfo.address = res[0].address
    hosInfo.hospitalLevel = res[0].hospitalLevel
    hosInfo.needSign = res[0].needSign
  })
}

// 锁号的记录释放号源
function cancelLock() {
  Dialog.confirm({
    title: '提示',
    message: '确定要取消您的预约吗？'
  })
    .then(() => {
      // on confirm
      const params = {
        orgId: tempInfo.orgId,
        recordId: tempInfo.recordId,
        idType: tempInfo.idType,
        idNo: tempInfo.idNo,
        cardNo: tempInfo.cardNo,
        cardType: tempInfo.cardType,
        orderUserId: tempInfo.orderUserId,
        treatUserId: tempInfo.treatUserId
      }
      releaseSource(params).then((res) => {
        Toast.success('取消成功')
        getData()
      })
    })
    .catch(() => {
      // on cancel
    })
}
/**
 * 取消预约
 */
function cancelSubscribe() {
  Dialog.confirm({
    title: '提示',
    message: '确定要取消您的预约吗？'
  })
    .then(() => {
      // on confirm
      let params = {
        orgId: tempInfo.orgId,
        businessCode: businessCode.value,
        recordId: tempInfo.recordId,
        idType: tempInfo.idType,
        idNo: tempInfo.idNo,
        cardNo: tempInfo.cardNo,
        cardType: tempInfo.cardType
      }
      cancelAppoint(params).then((res) => {
        Toast.success('取消成功')
        getData()
      })
    })
    .catch(() => {
      // on cancel
    })
}
/**
 * 重新预约
 */
function resetSubscribe() {
  // 转诊预约跳转路径做特殊处理
  if (businessCode.value === '03') {
    return referral()
  }
  const query = {
    orgId: tempInfo.orgId,
    hospitalName: tempInfo.hospitalName,
    deptId: tempInfo.deptId,
    deptName: tempInfo.deptName,
    businessCode: businessCode.value
  }
  router.push({
    path: '/appointment',
    query: query
  })
}
/**
 * 转诊预约跳转
 */
function referral() {
  if (tempInfo.transferInfo) {
    router.push(
      `/referral?outHospitalName=${
        tempInfo.transferInfo.outHospitalName
      }&outorgId=${tempInfo.transferInfo.outorgId}&firstJudge=${
        tempInfo.transferInfo.firstJudge || ''
      }&nowCase=${tempInfo.transferInfo.nowCase || ''}&pastCase=${
        tempInfo.transferInfo.pastCase || ''
      }&treatAndPlan=${tempInfo.transferInfo.treatAndPlan || ''}`
    )
  }
}

function gotoSign() {
  // 去签到
  const url = `/pages/sub/signMap/index?recordId=${tempInfo.recordId}`
  console.info(url)
  if (isWxMini.value) {
    wx.miniProgram.navigateTo({
      url: url
    })
  }
}
// 去支付
function goPay() {
  payRecharge({
    orgId: tempInfo.orgId,
    recordId: tempInfo.recordId
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
        'amount': tempInfo.medicalFee, // 金额，小程序收银台展示
        'returnUrl': window.YHSERVICECONFIG.base + 'yh-ep-appointment-front/#/bookingResult?result=success&id=' + tempInfo.recordId +
            '&orgId=' + tempInfo.orgId +
            '&deptId=' + tempInfo.deptId +
            '&deptName=' + tempInfo.deptName +
            '&hospitalName=' + tempInfo.hospitalName +
            '&businessCode=' + tempInfo.businessCode +
            '&status=6'
        // 支付成功回调地址，支付成功跳转地址
      },
      'credential': res.payParamVO.credential
    }
    // 2.进行序列化、encode处理
    const params = encodeURIComponent(JSON.stringify(orderInfo))
    console.log('请求小程序支付', orderInfo)
    // 3.携带参数并且跳转
    wx.miniProgram.getEnv((response: any) => {
      if (response.miniprogram) {
        wx.miniProgram.navigateTo({
          url: `/pages/cashier/index?urlParam=${params}`
        })
      }
    })
  })
}
</script>

<style scoped lang="scss">
@import './index';
</style>
