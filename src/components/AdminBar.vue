<template>
  <v-app-bar
    app
    color="primary"
    dark
    elevate-on-scroll
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer" />
    <v-app-bar-title class="flex-grow-1">
      {{ pageTitle }}/admin
    </v-app-bar-title>
    <v-spacer />
    <v-switch
      :value="darkMode"
      :input-value="darkMode"
      inset
      color="accent darken-3"
      label="Dark Mode"
      hide-details
      @change="toggleDarkMode"
    />
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminBar",
  data() {
    return {
      pageTitle: document.title,
    };
  },
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

<style scoped>
.v-input--switch {
  margin-top: 0 !important;
}
.v-input >>> .v-label {
  margin-left: 6px;
  margin-top: 2px;
}
</style>
