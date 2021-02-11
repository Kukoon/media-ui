<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>

    <v-toolbar-title link to="/">media.kukoon.de</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-switch
      :value="darkMode"
      :input-value="darkMode"
      @change="toggleDarkMode"
      inset
      color="accent lighten-3"
      label="Dark Mode"
      hide-details
    ></v-switch>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminBar",
  computed: {
    ...mapGetters(["darkMode"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
    toggleDarkMode() {
      this.$store.commit("toggleDarkMode", !this.darkMode);
      this.$vuetify.theme.dark = this.darkMode;
    },
  },
};
</script>