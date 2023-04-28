<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router';
import { useInfoStore } from 'src/stores/info';
const infoStore = useInfoStore()
const router = useRouter()
const username = ref('aaa')
const passwd = ref('root')
const login = () => {
  api.post('/state/login', JSON.stringify(
    {
      'username': username.value,
      'password': passwd.value
    }
  ), {
    'content-type': 'application/json',
    withCredentials: true
  }
  ).then(
    resp => {
      console.log(resp.data)
      infoStore.userId = resp.data.userId
      infoStore.userName = resp.data.userName
      infoStore.admin = resp.data.admin
      console.log(infoStore)
      router.push({ path: '/', })
    }
  ).catch(err => {
    console.log('login error', err)
  }
  )
}
</script>

<template>
  <div class="column flex-center q-gutter-lg" style="height: 100vh">
    <q-input outlined v-model="username" label="用户名" />
    <q-input outlined v-model="passwd" label="密码" />
    <div class="row">
      <q-btn class="q-ma-md" @click="login" label="登录"></q-btn>
      <q-btn class="q-ma-md" @click="login" label="注册"></q-btn>
    </div>
  </div>
</template>

<style scoped></style>
