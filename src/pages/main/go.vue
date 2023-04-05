<template>
  <q-page class="flex flex-center">

    <q-card class="q-ma-md sgf-load-card">
      <q-card-section>
        <div class="text-h6">加载sgf棋谱文件</div>
        <div class="text-subtitle2">powered by alist</div>
      </q-card-section>
      <q-separator inset />

      <q-list>
        <q-item clickable v-for="i in [1, 3, 4]" :key="i">
          <q-item-section>
            <q-item-label>Item with caption</q-item-label>
            <q-item-label caption>Caption</q-item-label>
          </q-item-section>

        </q-item>

      </q-list>
    </q-card>
    <div class="flex flex-center board-container">
      <div class="eidogo-player-auto" :sgf="sgfSource"></div>
      <div class="column">
        <q-btn class="q-ma-lg" @click="initBoard">reset</q-btn>
        <q-btn class="q-ma-lg" @click="console.log('hello')">export</q-btn>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import '/src/utils/main.js'
import { getCurrentInstance, onMounted } from 'vue'
const globals = getCurrentInstance().appContext.config.globalProperties;
const sgfSource = "/src/sgf/blood_vomit.sgf"
const initBoard = () => {
  window.dispatchEvent(new CustomEvent('eidogo'))
}
onMounted(initBoard)

</script>

<style scope>
.sgf-load-card {
  /* flex-basis: 20% */
  width: 20%;
  /* height: 30%;  it doesn't work... */
}

.board-container {
  flex-grow: 1;
}
</style>
