<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    :class="[darkMode ? 'neutral lighten-1' : null]"
    mobile-breakpoint="600"
  >
    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="{ name: item.title }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block text color="primary lighten-1"> Logout </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminDrawer",
  data() {
    return {
      items: [
        { title: "Stream", icon: "mdi-broadcast" },
        { title: "Chat", icon: "mdi-chat" },
        { title: "Videos", icon: "mdi-video" },
        { title: "Stats", icon: "mdi-chart-timeline-variant" },
        { title: "Server", icon: "mdi-server" },
        { title: "About", icon: "mdi-information" },
      ],
    };
  },
  computed: {
    ...mapGetters(["darkMode", "drawer"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
  },
};
</script>