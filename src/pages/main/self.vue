<script setup>
import { useInfoStore } from 'src/stores/info';

const infoStore = useInfoStore()
const userName = infoStore.userName
const userId = infoStore.userId
const admin = infoStore.admin
</script>

<template>
  <q-page class="column flex-center">
    <p>用户名 {{ userName }}</p>
    <p>用户id {{ userId }}</p>
    <p>管理员 {{ admin }}</p>
  </q-page>
</template>

<style scoped></style>
