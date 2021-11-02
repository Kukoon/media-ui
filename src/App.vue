<template>
  <v-app id="media-ui">
    <router-view />
  </v-app>
</template>

<script>
import "@/services/websocket.js";
import { mapGetters } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters(["darkMode"]),
  },
  mounted() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.toggleDarkMode();
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      function (e) {
        if (e.matches !== this.darkMode) {
          this.toggleDarkMode(e.matches);
        }
      }.bind(this)
    );
  },
  methods: {
    toggleDarkMode(bool) {
      if (bool) {
        this.$store.commit("toggleDarkMode", bool);
        this.$vuetify.theme.dark = bool;
      } else {
        this.$store.commit("toggleDarkMode", !this.darkMode);
        this.$vuetify.theme.dark = this.darkMode;
      }
    },
  },
};
</script>
