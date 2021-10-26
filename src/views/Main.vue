<template>
  <div id="Main">
    <NavDrawer :isLive="isLive" />
    <NavBar :isLive="isLive" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <v-footer color="grey darken-4" app style="z-index: 10">
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import NavDrawer from "@/components/NavDrawer";

import { config } from "../../config.js";
import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Main",
  components: { NavBar, NavDrawer },
  data() {
    return {
      isLive: true,
    }
  },
  created() {
    if (config.defaultChannel) {
      api.Channels.GetStream(config.defaultChannel).then((resp) => {
        this.isLive = resp.data.running;
        websocket.joinHandler(resp.data.channel.id, 'status', (ev) => {
          this.isLive = ev.running;
        })
      }, () => {
        this.isLive = false;
      })
    }
    // this.$store.dispatch("language");
  },
};
</script>
