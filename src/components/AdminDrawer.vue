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
          <v-badge overlap color="red" content="dev" v-if="item.dev"></v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block text color="primary lighten-1" @click="logout"> Logout </v-btn>
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
        { title: "Channels", icon: "mdi-broadcast" },
        { title: "Stream", icon: "mdi-calendar", dev: true },
        { title: "Chat", icon: "mdi-chat", dev: true },
        { title: "Videos", icon: "mdi-video", dev: true },
        { title: "Stats", icon: "mdi-chart-timeline-variant", dev: true },
        { title: "Server", icon: "mdi-server", dev: true },
        { title: "About", icon: "mdi-information", dev: true },
      ],
    };
  },
  computed: {
    ...mapGetters(["darkMode", "drawer"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
    logout() {
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      });
      this.$store.commit("user", {});
      this.$router.replace({ name: 'Home' })
    },
  },
};
</script>
