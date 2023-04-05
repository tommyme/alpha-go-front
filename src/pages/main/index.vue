<template>
  <q-page class="flex flex-center">
    <div class="text-h1">hello Go</div>
    <div>{{ xxx }}</div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
const xxx = ref(document.cookie)
</script>
