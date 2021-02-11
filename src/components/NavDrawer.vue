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
        link
        :to="{ name: pages[0].target, query: { id: 'kukoon' } }"
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