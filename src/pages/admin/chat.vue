<script setup>
import { onMounted, ref, reactive } from 'vue';
import { wsUrl } from 'src/utils/main'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useInfoStore } from 'src/stores/info';

const infoStore = useInfoStore()
const $q = useQuasar()
const router = useRouter()
let currentWs = null
function createWsConn(targetId) {
  const ws = new WebSocket(`${wsUrl}?to=${targetId}`)
  ws.addEventListener('message', (event) => {
    // 来消息了
    console.log("ws message")
    console.log(event)
    // window._event = event
    // event.data is a string.
    messages.push({
      msg: event.data,
      userId: targetId,
      // userName: "官方客服"
    })
  })
  currentWs = ws
}
const messages = reactive([])

function checkCookie() {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var name = cookies[i].split('=')[0].trim();
    if (name === 'sess') {
      return true;
    }
  }
  return false;
}

function getHistory(targetId) {
  api.get('/state/messages', {
    withCredentials: true
  })
    .then(response => response.data)
    .then(data => {
      Object.assign(messages, data)
      console.log(data)
    })
}

onMounted(
  () => {
    // 检查是否有sess key
    if (!checkCookie()) {
      // 没有 进行alert
      $q.dialog({
        title: '提示 聊天为登录功能',
        message: '请先登录'
      }).onOk(() => {
        router.push({ path: "/main/login" })
      }).onCancel(() => {
        router.push({ path: "/main/login" })
      }).onDismiss(() => {
        router.push({ path: "/main/login" })
      })
      return
    }
  }
)
const msg2send = ref("")
const sendMessage = (ws) => {
  if (msg2send.value === "") {
    alert("消息不能为空")
    return
  }
  ws.send(msg2send.value)
  messages.push({
    msg: msg2send.value,
    userId: infoStore.userId,
    userName: infoStore.userName,
  })
  msg2send.value = ""
}
</script>

<template>
  <q-page class="flex flex-center row">
    <q-card class="col-6 row justify-center">
      <div class="q-pa-md row justify-center col-12">
        <div class="col-6">
          <q-chat-message v-for="item, idx in messages" :key="idx" :name="item.userName" :text="[item.msg]"
            :sent="item.userName != '官方客服'" />
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
