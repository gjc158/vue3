<script setup lang="ts">
import { computed, ref } from 'vue'
import { store, useStore } from '@/store'
import http from '../utils/server'
try {
  let data =  http.get({url: 'getUsers'})
  console.log(data)
} catch(error) {
  console.log('Error loading server', error)
}

const count = ref(0)
const showCount = computed(() => {
  return store.getters.getCount
})
const addButton = () => {
  count.value++
  store.commit('setCount', count.value)
}
// fetch("/api/getUsers")
//   .then(response => {
//     return response.json()
//   })
//   .then(data => {
//     console.log('/api/getUsers', data)
//   })

</script>

<template>
  <h2>{{ showCount }}</h2>
  <button type="button" @click="addButton">点我加1</button>
  <van-button type="success">主要按钮</van-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
