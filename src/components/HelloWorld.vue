<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import http from '../utils/server'
try {
  let data =  http.get({url: 'getUsers'})
  console.log(data)
} catch(error) {
  console.log('Error loading server', error)
}
const store = useStore()
console.info(store)
const count = ref(store.getters["home/getCount"])
const showCount = computed(() => {
  return store.getters["home/getCount"]
})
const addButton = () => {
  count.value++
  store.commit('home/setCount', count.value)
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
