<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title link to="/">media.kukoon.de</v-toolbar-title>
    <v-switch
      :value="darkMode"
      :input-value="darkMode"
      @change="toggleDarkMode"
      inset
      color="accent lighten-3"
      :label="darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'"
      hide-details
      class="px-4"
    ></v-switch>
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
          target: "RecordingsList",
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
    toggleDarkMode() {
      this.$store.commit("toggleDarkMode", !this.darkMode);
      this.$vuetify.theme.dark = this.darkMode;
    },
  },
};
</script>