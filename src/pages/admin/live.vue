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
  <q-page class="flex flex-center">
    <div class="col-8 row justify-center" style="flex-grow: 1;">
      <q-list bordered class="rounded-borders col-10">
        <q-item v-for="item, idx in liveList" :key="idx" clickable v-ripple class="justify-evenly">
          <q-item-section>{{ item.uid }}</q-item-section>
          <q-item-section class="col-2">
            <q-btn label="del" color="primary" @click="deleteLive(item.idx)"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style scoped></style>
