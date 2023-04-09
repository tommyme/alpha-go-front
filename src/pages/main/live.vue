<script setup>

import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const data = reactive([])
const youtubers = reactive([])
const $q = useQuasar()
onMounted(
  () => {
    api.get('/stateless/live').then((resp) => resp.data).then((respdata) => {
      console.log(respdata)
      Object.assign(data, respdata)
      data.forEach(item => {
        let url = `http://localhost:8000/stateless/relay?url=https://api.bilibili.com/x/space/acc/info?mid=${item.uid}`
        axios.get(url).then(response => {
          return response.data.data
        })
          .then(jsdata => {
            youtubers.push({
              name: jsdata.name,
              face: jsdata.face,
              live_room: jsdata.live_room
            })
          })
      })
      console.log(youtubers)
    })


  }
)
const jump2url = (url) => {
  $q.dialog({
    title: '提示',
    message: '前往bilibili 观看直播'
  }).onOk(() => {
    window.location.href = url
  }).onCancel(() => {

  }).onDismiss(() => {

  })
}
</script>

<template>
  <q-page class="row justify-center">
    <div class="row col-8 items-start">
      <q-card class="q-ma-md col-3" v-for="item, idx in youtubers" :key="idx" @click="jump2url(item.live_room.url)">

        <q-img :src="item.face" alt="" height="200px" />

        <q-card-section>
          <q-item>
            <q-item-section>
              <div>{{ item.name }}</div>
              <div>{{ item.live_room.liveStatus ? "正在直播" : "未直播" }}</div>
            </q-item-section>

          </q-item>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<style scoped></style>
