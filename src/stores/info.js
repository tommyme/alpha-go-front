import { defineStore } from 'pinia';

export const useInfoStore = defineStore('info', {
  state: () => ({
    userId: "",
    userName: "",
    admin: false
  }),
});
