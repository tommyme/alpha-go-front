<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->
    <div class="eidogo-player-auto" sgf="/src/sgf/blood_vomit.sgf"></div>
    <q-btn @click="a">hello</q-btn>
  </q-page>
</template>

<script setup>
import '/src/utils/main.js'
import { getCurrentInstance } from 'vue'
const globals = getCurrentInstance().appContext.config.globalProperties;

const a = () => {
  console.log(globals.$q)
  window.dispatchEvent(new CustomEvent('eidogo'))
}
</script>
