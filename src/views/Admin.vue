<template>
  <div id="Admin">
    <AdminBar />
    <Drawer
      ref="drawer"
      :channelid="channelid"
    />
    <v-main>
      <router-view @change-channel="updateDrawer" />
    </v-main>
  </div>
</template>

<script>
import Drawer from "@/components/AdminDrawer";
import AdminBar from "@/components/AdminBar";

import { store } from "@/services/store.js";

export default {
  name: "Admin",
  components: { Drawer, AdminBar },
  beforeRouteEnter(to, from, next) {
    store
      .dispatch("getLoginStatus")
      .then(() => {
        if (!store.getters.loggedin) {
          next((vm) => vm.$router.replace({ name: "Login" }));
        } else {
          next();
        }
      })
      .catch(() => {
        next((vm) => vm.$router.replace({ name: "Login" }));
      });
  },
  props: ["channelid"],
  data() {
    return {
      showAlert: false,
    };
  },
  created() {
    this.$store.commit("toggleDarkMode", true);
    this.$store.commit("toggleDrawer", true);
    this.$vuetify.theme.dark = this.$store.getters.darkMode;
  },
  methods: {
    updateDrawer() {
      this.$refs.drawer.load();
    },
  },
};
</script>