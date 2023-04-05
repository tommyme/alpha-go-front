<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router';
const router = useRouter()
const username = ref('admin')
const passwd = ref('admin')
const login = () => {
  api.post('/admin/login', JSON.stringify(
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
      console.log(resp)
      router.push({ path: '/admin/', })
    }
  ).catch(err => {
    console.log('login error', err)
  }
  )
}
</script>

<template>
  <div class="column flex-center q-gutter-lg" style="height: 100vh">
    <q-input outlined v-model="username" label="username" />
    <q-input outlined v-model="passwd" label="password" />
    <q-btn @click="login" label="login"></q-btn>
  </div>
</template>

<style scoped></style>
