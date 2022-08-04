<template>
  <div class="booking-result">
    <!--成功-->
    <g-success-result
      v-if="isSuccess"
      :title="success.title"
      :url="success.url"
      :query='success.query'
      :urlText="success.urlText"
      :data="success.data"
    />
    <!--失败-->
    <g-fail-result
      v-if="!isSuccess"
      :title="fail.title"
      :subTitle="fail.subTitle"
      :urlText="fail.urlText"
      @confirm="handleFailConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import GSuccessResult from '@/components/GSuccessResult/index.vue'
import GFailResult from '@/components/GFailResult/index.vue'
import { desensitization, orderStatusFmt } from '@/utils/utils'
import { getRecordList, getPayRecordDetail, appointConfirm } from '@/api/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const payOrdId = ref('') // 支付返回的支付id
const orgId = ref('') // 医院id
let timer: any = ref(null) // 循环监听返回
const isSuccess = ref(true)
let success = reactive<any>({
  title: '',
  url: '',
  query: {},
  urlText: '',
  data: []
})
const fail = reactive({
  title: '预约失败',
  subTitle: '当前预约申请已失效<br>请返回预约挂号页面重新申请',
  urlText: '重新预约'
})
toRefs(fail)
  
onMounted(() => {
  console.log(route.query)
  if (route.query.result && route.query.result === 'fail') {
    // 更新报错提示
    if (route.query.resMsg) {
      fail.subTitle = `${route.query.resMsg}<br>请返回预约挂号页面重新申请`
    }
    isSuccess.value = false
  } else {
    if (route.query.status === '6') { // 支付返回
      success.title ='支付中'
      success.ur = '/subscribeList'
      success.urlText = '查看我的预约'
      success.query = {}
      success.data = [
        {
          id: 'name',
          name: '就诊人',
          value: ''
        },
        {
          id: 'phone',
          name: '手机号',
          value: ''
        },
        {
          id: 'hospitalName',
          name: '就诊医院',
          value: ''
        },
        {
          id: 'deptName',
          name: '就诊科室',
          value: ''
        },
        {
          id: 'doctorName',
          name: '就诊医生',
          value: ''
        },
        {
          id: 'time',
          name: '就诊时间',
          value: '',
          color: '#3186FF'
        },
        {
          id: 'medicalFee',
          name: '医事服务费',
          value: '',
          color: '#3186FF',
          money: true
        }
      ]
      
      getPayRecordDetailFn()
    } else {
      success.title = '预约成功'
      success.url = '/subscribeList'
      success.urlText = '查看我的预约'
      success.query = {
        // token: route.query.token || this.$store.getters.token
      }
      success.data = [
        {
          id: 'name',
          name: '就诊人',
          value: ''
        },
        {
          id: 'phone',
          name: '手机号',
          value: ''
        },
        {
          id: 'hospitalName',
          name: '就诊医院',
          value: ''
        },
        {
          id: 'deptName',
          name: '就诊科室',
          value: ''
        },
        {
          id: 'doctorName',
          name: '就诊医生',
          value: ''
        },
        {
          id: 'time',
          name: '就诊时间',
          value: '',
          color: '#3186FF'
        },
        {
          id: 'medicalFee',
          name: '医事服务费',
          value: '',
          color: '#3186FF',
          money: true
        }
      ]
      init()
    }
  }
})

onUnmounted(() => {
  clearInterval(timer.value)
})
/**
 * 初始化
 */
function init() {
  isSuccess.value = true
  const id = route.query.id
  if (!id) {
    return
  }
  getRecordList({
    orgId: route.query.orgId,
    status: route.query.status,
    recordId: route.query.id
  }).then((res: any) => {
    if (res[0] && !res[0].name) {
      // 未实名，姓名不显示
      success.data.splice(0, 1)
      console.info(success.data)
    }
    for (const item of success.data) {
      if (item.id === 'time') {
        item.value = res[0].scheduleDate + ' ' + res[0].sourceTime
        continue
      }

      if (item.id === 'phone' || item.id === 'name') {
        item.value = desensitization(res[0][item.id])
        continue
      }

      if (item.id === 'medicalFee') {
        item.value = res[0][item.id] ? res[0][item.id] : '线下确认'
        continue
      }

      if (res[0][item.id]) {
        item.value = res[0][item.id]
      }
    }
  })
}

/**
 * 支付结果
 */
function getPayRecordDetailFn() {
  getPayRecordDetail({
    orgId: route.query.orgId || '',
    recordId: route.query.id || ''
  }).then((res: any) => {
    if (Number(res.status) === 1) { // 已预约
      successData(res)
    } else {
      setTimeout(() => {
        getPayRecordDetailFn()
      }, 3000)
    }
  })
}
/**
 * 预约成功的数据整理
*/
function successData(res: any) {
  console.log('预约成功', res)
  success.title = orderStatusFmt(res.status)
  success.query = {
    treatUserId: res.treatUserId,
    cardType: res.cardType,
    cardNo: res.cardNo,
    idType: res.idType,
    idNo: res.idNo,
    businessCode: res.businessCode
  }
  for (const item of success.data) {
    if (item.id === 'time') {
      item.value = res.scheduleDate + ' ' + res.sourceTime
      continue
    }

    if (item.id === 'phone' || item.id === 'name') {
      item.value = desensitization(res[item.id])
      continue
    }

    if (res[item.id]) {
      item.value = res[item.id]
    }
  }
}
/**
 * 确认预约
*/
function appointConfirmFn(data: any) {
  appointConfirm({
    orgId: data.orgId,
    recordId: data.recordId,
    idType: data.idType,
    idNo: data.idNo,
    cardType: data.cardType,
    cardNo: data.cardNo
  }).then(res => {
    console.log(res)
    init()
  })
}

/**
 * 处理失败情况下的确认按钮
 */
function handleFailConfirm() {
  window.history.go(-2)
  return false
  // businessCode=00&orgId=test009&hospitalName=福鼎市同禾医院&deptId=34eb5dd55ddccdbcd4b3a83d1edcbd2d&deptName=骨科003
  // const query_param = route.query
  // console.info(query_param)
  // gotoPage.call(this, '/appointment', {
  //   token: query_param.token,
  //   orgId: query_param.orgId,
  //   deptId: query_param.deptId,
  //   deptName: query_param.deptName,
  //   hospitalName: query_param.hospitalName,
  //   businessCode: query_param.businessCode
  // })
  // return false
}
</script>

<style scoped lang="scss"></style>
