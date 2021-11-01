<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    right
    disable-resize-watcher
    style="z-index: 20"
  >
    <div
      class="fill-height d-flex flex-column"
      :style="[darkMode ? { 'background-color': '#121212' } : '']"
    >
      <v-card tile flat>
        <v-card-title class="subtitle-1">{{ pageTitle }}</v-card-title>
        <v-card-subtitle>Menu</v-card-subtitle>
      </v-card>
      <v-divider />
      <v-list dense>
        <v-list-item
          link
          v-if="isLive"
          :to="{ name: 'Live', params: { id: channel } }"
          :class="darkMode ? 'grey lighten-1' : 'grey darken-2'"
        >
          <v-list-item-action>
            <v-icon>mdi-broadcast</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Live</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          :to="{ name: 'VideoList' }"
          :class="darkMode ? 'neutral darken-1' : 'neutral lighten-3'"
        >
          <v-list-item-action>
            <v-icon>mdi-video-vintage</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Recordings</v-list-item-title>
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
  props: ["isLive"],
  data: () => ({
    pageTitle: document.title,
    channel: config.defaultChannel,
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
