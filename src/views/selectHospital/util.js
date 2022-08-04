export const toPageMap = {
  /**
   * 跳转预约挂号
   * @param {*} hospitalInfo 医院信息
   * @returns 路由跳转对象参数
   */
  appoint(hospitalInfo) {
    return {
      path: '/departmentNavigate',
      query: {
        isOutpatient: true,
        medicalId: hospitalInfo.id,
        hosOrgCode: hospitalInfo.hosOrgCode,
        hosName: hospitalInfo.fullName
      }
    }
  },
  /**
   * 跳转报告单
   * @param {*} hospitalInfo 医院信息
   * @returns 路由跳转对象参数
   */
  report(hospitalInfo) {
    return {
      path: '/inspectionReport',
      query: {
        hosOrgCode: hospitalInfo.hosOrgCode
      }
    }
  },
  hospital(hospitalInfo) {
    const { id } = hospitalInfo
    return {
      path: '/officialWeb',
      query: {
        medicalId: id
      }
    }
  },
  hospitalDetail(hospitalInfo) {
    const { id } = hospitalInfo
    return {
      path: '/hospitalNavigate',
      query: {
        medicalId: id
      }
    }
  },
  /**
   * 门诊记录
   * @param {*} hospitalInfo
   * @returns
   */
  outpatientRecord(hospitalInfo) {
    return {
      path: '/outpatientRecord',
      query: {
        hosOrgCode: hospitalInfo.hosOrgCode,
        hosName: hospitalInfo.fullName
      }
    }
  },
  /**
   * 住院记录
   * @param {}} hospitalInfo
   * @returns
   */
  inhospitalRecord(hospitalInfo) {
    return {
      path: '/inhospitalRecord',
      query: {
        hosOrgCode: hospitalInfo.hosOrgCode,
        hosName: hospitalInfo.fullName
      }
    }
  },
  inhospitalRecharge(hospitalInfo) {
    return {
      path: '/inhospitalRecharge',
      query: {
        hosOrgCode: hospitalInfo.hosOrgCode,
        hosName: hospitalInfo.fullName
      }
    }
  }
}
