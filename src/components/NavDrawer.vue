<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    right
    disable-resize-watcher
    style="z-index: 20"
  >
    <div class="fill-height d-flex flex-column">
      <v-card tile flat>
        <v-card-title class="subtitle-1"> media.kukoon.de </v-card-title>
        <v-card-subtitle>Menu</v-card-subtitle>
      </v-card>
      <v-divider />
      <v-list dense>
        <v-list-item
          link
          v-if="channel"
          :to="{ name: pages[0].target, query: { id: channel } }"
        >
          <v-list-item-action>
            <v-icon>{{ pages[0].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ pages[0].name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: pages[1].target }">
          <v-list-item-action>
            <v-icon>{{ pages[1].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ pages[1].name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="mt-auto" />
      <v-card tile flat class="flex-row justify-space-between">
        <v-card-title class="subtitle-2">Settings</v-card-title>
        <v-card-text>
          <v-switch
            :value="darkMode"
            :input-value="darkMode"
            @change="toggleDarkMode"
            color="accent lighten-3"
            hide-details
            :label="darkMode ? 'Dark Mode' : 'Dark Mode'"
          ></v-switch>
        </v-card-text>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { config } from "../../config.js";

export default {
  data: () => ({
    channel: config.defaultChannel,
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
  }),
  computed: {
    ...mapGetters(["darkMode", "drawer"]),
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
  margin-left: 12px;
  margin-top: 2px;
}
</style>
