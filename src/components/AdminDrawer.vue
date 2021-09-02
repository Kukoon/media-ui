<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    :class="[darkMode ? 'neutral lighten-1' : null]"
    mobile-breakpoint="600"
  >
    <v-list dense>
      <v-list-item>
        <v-list-item-avatar v-if="channel" color="black">
          <v-img v-if="channel.logo" :src="channel.logo" contain></v-img>
          <span v-else>{{ channel.title.slice(0, 2) }}</span>
        </v-list-item-avatar>
        <v-spacer v-if="channel"></v-spacer>
        <v-list-item-icon v-if="channel" class="my-auto">
          <v-btn icon small :to="{ name: 'ChannelEdit', params: { channelid: selectionAdminChannel } }">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-avatar v-else color="indigo">
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-group :value="channelMenuOpen">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="text-h7" v-if="channel">{{
              channel.title
            }}</v-list-item-title>
            <v-list-item-title class="text-h7" v-else
              >Channels:
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(channel, i) in channels"
          :key="i"
          link
          :to="{ name: 'AdminChannel', params: { channelid: channel.id } }"
        >
          <v-list-item-avatar color="black" size="24" class="mr-8">
            <v-img v-if="channel.logo" :src="channel.logo" contain></v-img>
            <span v-else>{{ channel.title.slice(0, 2) }}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ channel.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'ChannelAdd' }">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Add</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <v-list dense v-if="channel">
      <v-subheader>Channel</v-subheader>
      <v-list-item
        v-for="item in channelMenu"
        :key="item.title"
        link
        :to="{ name: item.title, params: { channelid: selectionAdminChannel } }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
          <v-badge overlap color="grey" content="dev" v-if="item.dev"></v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <v-subheader>Global</v-subheader>
      <v-list-item
        v-for="item in globalMenu"
        :key="item.title"
        link
        :to="{ name: item.title }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
          <v-badge overlap color="grey" content="dev" v-if="item.dev"></v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block text color="primary lighten-1" @click="logout">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { api } from "@/services/api.js";

export default {
  name: "AdminDrawer",
  props: ["channelid"],
  data() {
    return {
      channelMenuOpen: !this.channelid,
      channel: null,
      channels: [],
      channelMenu: [
        { title: "Stream", icon: "mdi-broadcast", dev: true },
        { title: "Distribution", icon: "mdi-vector-polyline" },
        { title: "Videos", icon: "mdi-video", dev: true },
      ],
      globalMenu: [
        { title: "Stats", icon: "mdi-chart-timeline-variant", dev: true },
        { title: "Server", icon: "mdi-server", dev: true },
        { title: "About", icon: "mdi-information", dev: true },
      ],
    };
  },
  computed: {
    ...mapGetters(["darkMode", "drawer", "selectionAdminChannel"]),
  },
  methods: {
    ...mapActions(["toggleDrawer", "setSelectionAdminChannel"]),
    load() {
      api.Channels.My().then((response) => {
        this.channels = response.data;
        const channel = this.channels.find((el) => el.id == this.selectionAdminChannel);
        if (channel) {
          this.channel = channel;
        } else {
          this.channel = null;
        }
      });
    },
    logout() {
      document.cookie.split(";").forEach(function (c) {
        document.cookie =
          c.trim().split("=")[0] +
          "=;" +
          "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      });
      this.$store.commit("user", {});
      this.$router.replace({ name: "Home" });
    },
  },
  watch: {
    channelid(to) {
      if (to) {
        this.setSelectionAdminChannel(to);
      }
      if(this.selectionAdminChannel) {
        this.channelMenuOpen = false;
      }
    },
    $route() {
      this.load();
    },
  },
  created() {
    if (this.channelid) {
      this.setSelectionAdminChannel(this.channelid);
    }
    this.load();
  },
};
</script>

<style lang="scss" scoped>
.v-list-item--active {
  color: var(--v-primary-base) !important;
  caret-color: var(--v-primary-base) !important;
}
</style>
