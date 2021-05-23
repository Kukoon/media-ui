<template>
  <v-app id="media-ui">
    <router-view></router-view>
  </v-app>
</template>

<script>

import  '@/services/websocket.js'

export default {
  name: "App",
};
</script>
