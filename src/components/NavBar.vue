<template>
  <v-app-bar app :color="darkMode ? 'accent' : 'primary'" dark>
    <v-img
      src="@/assets/logo3.png"
      height="90%"
      max-width="88.4"
      contain
      class="flex-grow-0"
    ></v-img>
    <!-- <v-toolbar-title link to="/">v2.media.kukoon.de</v-toolbar-title> -->
    <v-spacer></v-spacer>
    <v-btn
      text
      class="mx-2 mr-1 d-none d-sm-flex"
      :to="{ name: pages[0].target, query: { id: 'kukoon' } }"
    >
      {{ pages[0].name }}
    </v-btn>
    <v-btn
      text
      class="mx-2 mr-1 d-none d-sm-flex"
      :to="{ name: pages[1].target }"
    >
      {{ pages[1].name }}
    </v-btn>

    <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      pages: [
        {
          name: "Live",
          target: "Live",
          id: 0,
          icon: "mdi-broadcast",
        },
        {
          name: "Recordings",
          target: "VideoList",
          id: 1,
          icon: "mdi-video-vintage",
        },
      ],
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