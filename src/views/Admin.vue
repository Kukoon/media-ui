<template>
  <div id="Admin">
    <AdminBar />
    <Drawer :channelid="channelid"/>

    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import Drawer from "@/components/AdminDrawer";
import AdminBar from "@/components/AdminBar";

import { store } from "@/services/store.js";

export default {
  name: "Admin",
  props: ["channelid"],
  components: { Drawer, AdminBar },
  beforeRouteEnter(to, from, next) {
    store.dispatch('getLoginStatus').then(() => {
      if(!store.getters.loggedin) {
        next(vm => vm.$router.replace({ name: "Login" }));
      } else {
        next()
      }
    }).catch(() => {
        next(vm => vm.$router.replace({ name: "Login" }));
    })
  },
  created() {
    this.$store.commit("toggleDarkMode", true);
    this.$vuetify.theme.dark = this.$store.getters.darkMode;
  },
};
</script>
