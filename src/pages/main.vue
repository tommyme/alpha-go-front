<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> 围棋资讯平台 </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "home page",
    caption: "回到主页",
    icon: "home",
    link: "#/main",
  },
  {
    title: "2022棋手排名",
    caption: "职业棋手排名信息",
    icon: "school",
    link: "#/main/rank",
  },
  {
    title: "play Go",
    caption: "看棋谱",
    icon: "code",
    link: "#/main/go",
  },
  {
    title: "Article",
    caption: "view Article",
    icon: "book",
    link: "#/main/article/list",
  },
  {
    title: "Live",
    caption: "看看热门围棋直播",
    icon: "rss_feed",
    link: "#/main/live",
  },
  {
    title: "围棋咨询",
    caption: "咨询围棋相关事项",
    icon: "public",
    link: "#/main/chat",
  },
  {
    title: "登录",
    caption: "登录以使用更多功能",
    icon: "favorite",
    link: "#/main/login",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
