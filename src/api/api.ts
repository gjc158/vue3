import $https from "@/utils/server/request"

const url = import.meta.env.VITE_APP_API_LOCATION
// 获取医院列表
export const getHospitalList = (params: object) => {
  return $https({
    url: url + 'IApplyAppointService/queryHospitalList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取医院分页数据
export const queryHospitalPage = (params: object) => {
  return $https({
    url: url + 'IApplyAppointService/queryHospitalPage',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取缓存用户信息
export const saveUserCache = (params: object) => {
  return $https({
    url: url + 'IUserHandlerService/saveUserCache',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取所有科室列表
export const queryDeptList = (params: object) => {
  return $https({
    url: url + 'IApplyAppointService/queryDeptList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取可预约科室列表
export const queryDeptAppointList = (params: object) => {
  return $https({
    url: url + 'IApplyAppointService/queryDeptAppointList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取所有医生列表
export const queryDoctorList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/queryDoctorList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取可预约医生列表
export const queryDoctorAppointList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/queryDoctorAppointList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取排班列表
export const queryScheduleList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/queryScheduleList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取排班列表带医生信息
export const queryDoctorScheduleList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/queryDoctorScheduleList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取号源列表
export const querySourceList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/querySourceList',
    method: 'POST',
    data: {
      param: params
    }
  })
}
// 获取号源列表-组合
export const querySourceCombinationList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/querySourceCombinationList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取缓存用户信息
export const getUserCache = (params: object) =>{
  return $https({
    url: '/api/ep/auth/user/query',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取缓存用户信息
export const queryUserInfo = (params: object) =>{
  return $https({
    url: '/api/ep/uc/UcUserRelation/queryUserInfo',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 预约操作
export const appoint = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/appoint',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取预约列表和详情
export const getRecordList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/getRecordList',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取预约列表和详情(支付结果页使用)
export const getPayRecordDetail = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/getPayRecordDetail',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取预约分页和详情
export const getRecordPage = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/getRecordPage',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 取消预约
export const cancelAppoint = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/cancelAppoint',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 锁号(支付类型为线上支付调用) 支付类型 0-无需支付 -1线上支付 2-线下支付
export const lockSource = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/lockSource',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 释放号源
export const releaseSource = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/releaseSource',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 确认预约(锁号无需支付时调用) 支付类型 0-无需支付 -1线上支付 2-线下支付
export const appointConfirm = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/appointConfirm',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 预约付款
export const payRecharge = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/lockSourcePay',
    method: 'POST',
    data: {
      param: params
    }
  })
}

// 获取数据字典
export const getDictList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/getDictList',
    method: 'post',
    data: {
      param: params
    }
  })
}

// 获取数据字典（城市）-查询区域字典
export const getAreaDictList = (params: object) =>{
  return $https({
    url: url + 'IApplyAppointService/getAreaDictList',
    method: 'post',
    data: {
      param: params
    }
  })
}
