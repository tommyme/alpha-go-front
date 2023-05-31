<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>围棋资讯平台后台</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>快速链接</q-item-label>

        <SimpleEssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

import SimpleEssentialLink from 'src/components/SimpleEssentialLink.vue'

const linksList = [
  {
    title: '直播推荐管理',
    caption: '直播',
    icon: 'favorite',
    link: '#/admin/live',
  },
  {
    title: '文章列表',
    caption: '文章',
    icon: 'favorite',
    link: '#/admin/article/list',
  },
  {
    title: '添加文章',
    caption: '文章',
    icon: 'favorite',
    link: '#/admin/article/add',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    SimpleEssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
