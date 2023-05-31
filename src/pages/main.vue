<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>围棋资讯平台</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="column justify-between" style="height: 100%">
        <q-list>
          <q-item-label header>快捷链接</q-item-label>

          <EssentialLink :items="linksList" />
        </q-list>
        <q-img src="src/assets/icon1.png"></q-img>
      </div>
    </q-drawer>

    <q-page-container class="page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'src/components/EssentialLink.vue'
import { linksList } from 'src/utils/links'

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.page {
  background-image: url('assets/bg3.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
