<template>
  <v-app-bar app :color="darkMode ? 'accent' : 'primary'" dark>
    <router-link to="/" style="height: 90%">
      <v-img
        src="@/assets/logo3.png"
        height="100%"
        max-width="88.4"
        contain
        class="flex-grow-0"
      ></v-img>
    </router-link>
    <!-- <v-toolbar-title link to="/">media.kukoon.de</v-toolbar-title> -->
    <v-spacer></v-spacer>
    <v-btn
      text
      v-if="channel"
      class="mx-2 mr-1 d-none d-sm-flex"
      :to="{ name: 'Live', params: { id: channel } }"
    >
      Live
    </v-btn>
    <v-btn
      text
      class="mx-2 mr-1 d-none d-sm-flex"
      :to="{ name: 'VideoList' }"
    >
      Recordings
    </v-btn>

    <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { config } from "../../config.js";

export default {
  name: "NavBar",
  data() {
    return {
      channel: config.defaultChannel,
    };
  },
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
  },
};
</script>

<style scoped>
/* #logo {
  display: inherit;
  position: relative;
  max-height: 128px;
  max-width: 88.5px;
  padding: 10px;
  margin-top: 8px;
  margin-left: 12px;
  background: #770702;
  border-radius: 0 0 8px 8px;
  margin-bottom: -55.4px !important;
} */
</style>
