import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: '/selectHospital',
        meta: {
            title: '选择医院'
        }
    },
    {
        path: '/selectHospital',
        name: 'selectHospital',
        component: () => import('views/selectHospital/index.vue'),
        meta: {
            title: '选择医院'
        }
    },
    {
        path: '/departmentNavigateBack',
        name: 'DepartmentNavigateBack',
        component: () => import('views/departmentNavigateBack/index.vue'),
        meta: {
            title: '预约科室'
        }
    },
    {
        path: '/appointment',
        name: 'appointment',
        component: () => import('views/appointment/index.vue'),
        // meta: {
        //     title: '预约挂号'
        // }
    },
    {
        path: '/doctorPage',
        name: 'doctorPage',
        component: () => import('views/doctorPage/index.vue'),
        meta: {
            title: '医生主页'
        }
    },
    {
        path: '/reserveInformation',
        name: 'ReserveInformation',
        component: () => import('views/reserveInformation/index.vue'),
        meta: {
            title: '预约信息'
        }
    },
    {
        path: '/bookingResult',
        name: 'BookingResult',
        component: () => import('views/bookingResult/index.vue'),
        meta: {
            title: '预约结果',
            isNeedHomeBtn: false
        }
    },
    // 患者端
    {
        path: '/subscribeList',
        name: 'SubscribeList',
        component: () => import('views/subscribeList/index.vue'),
        meta: {
            title: '预约记录'
        }
    },
    {
        path: '/subscribeDetail',
        name: 'SubscribeDetail',
        component: () => import('views/subscribeDetail/index.vue'),
        meta: {
            title: '预约详情'
        }
    },
    // // 医生端
    // {
    //     path: '/appointList',
    //     name: 'AppointList',
    //     component: () => import('views/appointList/index.vue'),
    //     meta: {
    //         title: '预约记录'
    //     }
    // },
    // {
    //     path: '/appointListDetail',
    //     name: 'AppointListDetail',
    //     component: () => import('views/appointListDetail/index.vue'),
    //     meta: {
    //         title: '预约详情'
    //     }
    // }
]

// 使用工厂函数创建router
const router = createRouter({
    history: createWebHashHistory('/'), // 指定路由的模式,此处使用的是hash模式
    routes, // 路由地址
});

export default router;