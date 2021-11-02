<template>
  <div id="Main">
    <NavDrawer :is-live="isLive" />
    <NavBar :is-live="isLive" />
    <v-main>
      <router-view />
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
        this.connect(resp.data.channel.id);
      }, () => {
        this.isLive = false;
        api.Channels.Get(config.defaultChannel).then((resp) => {
          this.connect(resp.data.id);
        })
      })
    } else {
      this.isLive = false;
    }
    // this.$store.dispatch("language");
  },
  methods: {
    connect(channelID) {
      websocket.joinHandler(channelID, 'status', 'main for menu', (ev) => {
        if (this.isLive != ev.running) {
          this.isLive = ev.running;
	}
      })
    },
  },
};
</script>
