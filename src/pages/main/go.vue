<template>
  <q-page class="flex justify-evenly items-center">

    <q-card class="q-ma-md sgf-load-card">
      <q-card-section>
        <div class="text-h6">加载sgf棋谱文件</div>
      </q-card-section>
      <!-- <q-separator inset /> -->
      <q-card-section>
        <div class="text-subtitle2">从服务器加载</div>

      </q-card-section>
      <q-separator inset />

      <q-list>
        <q-scroll-area style="height:400px">

          <q-item clickable v-for="i, idx in remoteSgfList" :key="idx">
            <q-item-section @click="loadRemoteSgf(i.url)">
              <q-item-label>{{ i.file }}</q-item-label>
              <q-item-label caption>精选棋谱</q-item-label>
            </q-item-section>
          </q-item>
        </q-scroll-area>

      </q-list>
      <q-separator inset />
      <q-card-section>
        <q-file outlined v-model="localSgfFilePath" label="从本地加载" @update:model-value="loadFromLocal" />
      </q-card-section>
    </q-card>
    <div class="flex flex-center board-container">
      <div class="column items-start">
        <q-chip dense size="xl" icon="bookmark" class="q-my-md">
          {{ currentMode }}
        </q-chip>
        <div ref="eidogo" class="eidogo-player-auto"></div>
      </div>
      <div class="column">
        <q-btn class="q-ma-lg" @click="resetBoard">重置</q-btn>
        <q-btn class="q-ma-lg" @click="exportSgf">导出</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import '/src/utils/main.js'
import { getCurrentInstance, onMounted, ref } from 'vue'

const modeOptions = ['自我博弈模式', '棋谱阅读模式']
const currentMode = ref("")
const eidogo = ref(null)
const localSgfFilePath = ref("")
let currentPlayer = {}  // init later

const initBoard = () => {

  window.dispatchEvent(new CustomEvent('eidogo'))
  // 保存到 currentPlayer中
  const maxTimestamp = Math.max(...Object.keys(window.eidogo.players));
  currentPlayer = window.eidogo.players[maxTimestamp]
}
const resetBoard = () => {
  // 重置为自我博弈模式
  localSgfFilePath.value = ''       // 清空文件选择框
  currentMode.value = modeOptions[0]    // 切换模式banner
  initBoard()
  // 设置样式
  const el = document.querySelector('.comments')
  el.style.height = '0px'
  el.style.padding = '0px'
  el.style.border = '0px'
}
const loadEmptySgf = () => {
  // 自我博弈模式
  const content = "(;GM[1])"
  eidogo.value.innerHTML = content
  resetBoard()
}
const loadFromLocal = () => {
  // 从本地加载棋谱文件
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    eidogo.value.innerHTML = reader.result
    initBoard()
  })
  reader.readAsText(localSgfFilePath.value)
  currentMode.value = modeOptions[1]
}
const remoteSgfList = ref([])
const loadRemoteSgfList = () => {
  api.get('/stateless/sgf/list').then(resp => resp.data).then(data => remoteSgfList.value = data)
}
const loadRemoteSgf = (url) => {
  eidogo.value.setAttribute('sgf', url)
  initBoard()
}
const exportSgf = () => {
  console.log(currentPlayer)
  let fileContent = currentPlayer.cursor.getGameRoot().toSgf()
  console.log(fileContent)
  // 创建 Blob 对象
  const blob = new Blob([fileContent], { type: 'text/plain' });

  // 创建 URL 对象
  const url = URL.createObjectURL(blob);

  // 创建链接并下载文件
  const link = document.createElement('a');
  link.href = url;
  link.download = 'custom.sgf';
  document.body.appendChild(link);
  link.click();
  // 释放 URL 对象
  URL.revokeObjectURL(url);
}


onMounted(() => {
  loadRemoteSgfList()
  loadEmptySgf()

})

</script>

<style scope>
.sgf-load-card {
  /* flex-basis: 20% */
  width: 20%;
  /* height: 30%;  it doesn't work... */
}
</style>
