<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    right
    disable-resize-watcher
  >
    <v-list dense>
      <v-list-item
        v-for="page in pages"
        :key="page.id"
        link
        :to="{ name: page.target }"
      >
        <v-list-item-action>
          <v-icon>{{ page.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ page.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
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
  }),
  computed: {
    ...mapGetters(["drawer"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
  },
};
</script>