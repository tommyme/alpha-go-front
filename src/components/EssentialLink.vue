<template>
  <LinkItem
    v-for="(item, idx) in props.items"
    :key="idx"
    :data="item.data"
    :link="item.link"
    :children="item.children"
  ></LinkItem>
</template>

<script setup>
import { defineProps } from 'vue'
import LinkItem from './LinkItem.vue'
const props = defineProps(['items'])
</script>
