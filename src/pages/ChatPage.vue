<script setup>
import { onMounted, ref, reactive } from 'vue';
import { wsUrl } from 'src/utils/main'
import { api } from 'boot/axios'

const ws = new WebSocket(wsUrl)
ws.addEventListener('message', (event) => {
  messages.push(event.data)
})
const messages = reactive([])

onMounted(
  () => {
    api.get('/state/messages', {
      withCredentials: true
    })
      .then(response => response.data)
      .then(data => {
        Object.assign(messages, data)
      })
  }
)
const msg2send = ref("")
const sendMessage = () => {
  if (msg2send.value === "") {
    alert("消息不能为空")
    return
  }
  ws.send(msg2send.value)
  msg2send.value = ""
}
</script>

<template>
  <q-page class="flex flex-center row">
    <q-card class="col-6 row justify-center">
      <div class="q-pa-md row justify-center col-12">
        <div class="col-6">
          <q-chat-message v-for="item, idx in messages" :key="idx" :name="item.userName" :text="[item.msg]"
            :sent="item.userName == 'admin'" />
        </div>
      </div>
      <q-card-section class="col-8 row items-center">
        <q-input class="q-ml-md" style="flex-grow: 1" outlined v-model="msg2send" label="发送消息"
          @keyup.enter="sendMessage" />
        <q-btn class="q-ma-md" label="send" @click="sendMessage"></q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
