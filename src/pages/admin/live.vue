<script setup>
import { api } from 'src/boot/axios';
import { onMounted, reactive } from 'vue';
const liveList = reactive([])
// 直播
onMounted(() => {
  api.get('/stateless/live').then(resp => resp.data).then(data => {
    Object.assign(liveList, data)
    console.log(liveList)
  })
})

const deleteLive = (idx) => {
  console.log("tring to delete live " + idx)
}
</script>

<template>
  <q-page class="row flex-center">
    <div class="col-6">
      <q-list bordered class="rounded-borders">
        <q-item v-for="item, idx in liveList" :key="idx" clickable v-ripple class="justify-evenly">
          <q-item-section>{{ item.name + " " + item.uid }}</q-item-section>
          <q-item-section class="col-2">
            <q-btn label="删除推荐" color="primary" @click="deleteLive(item.idx)"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="row q-my-lg justify-evenly items-center">
        <q-input class="col-6" outlined v-model="text" label="新增直播间mid" />
        <q-btn class="col-2" label="添加" color="primary"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
