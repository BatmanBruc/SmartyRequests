<script lang="ts">
 import { defineComponent } from 'vue'

  export default defineComponent({
    name: "App",
  })

</script>

<template>
<a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <router-link to="/requests"><a-menu-item key="1">Заявки</a-menu-item></router-link>
        <router-link to="/fields"><a-menu-item key="2">Поля заявки</a-menu-item></router-link>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
</style>
