import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const req1 = require.context('./linearsvg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
requireAll(req1)
