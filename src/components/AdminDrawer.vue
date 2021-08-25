<template>
  <v-navigation-drawer
    :value="drawer"
    @input="toggleDrawer"
    app
    :class="[darkMode ? 'neutral lighten-1' : null]"
    mobile-breakpoint="600"
  >
    <v-list>
        <v-list-item>
          <v-list-item-avatar v-if="channel" color="black">
            <v-img v-if="channel.logo" :src="channel.logo" contain></v-img>
            <span  v-else>{{ channel.title.slice(0,2) }}</span>
          </v-list-item-avatar>
          <v-list-item-content v-if="channel">
          </v-list-item-content>
          <v-list-item-icon v-if="channel">
            <v-btn icon class="mr-4" :to="{name: 'ChannelEdit'}">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-avatar v-else color="indigo">
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-group
          value="channelMenuOpen"
        >
          <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="text-h6" v-if="channel">{{ channel.title }}</v-list-item-title>
            <v-list-item-title class="text-h6" v-else>Channels: </v-list-item-title>
          </v-list-item-content>
          </template>
          <v-list-item
            v-for="(channel, i) in channels"
            :key="i"
            link
            :to="{ name: 'ChannelEdit', params: { channelid: channel.id }}"
          >
            <v-list-item-avatar color="black">
              <v-img v-if="channel.logo" :src="channel.logo" contain></v-img>
              <span  v-else>{{ channel.title.slice(0,2) }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              {{channel.title}}
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
        <v-btn block text color="primary lighten-1" @click="logout"> Logout </v-btn>
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
        { title: "Restream", icon: "mdi-broadcast" },
        { title: "Stream", icon: "mdi-calendar", dev: true },
        { title: "Chat", icon: "mdi-chat", dev: true },
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
    ...mapGetters(["darkMode", "drawer"]),
  },
  methods: {
    ...mapActions(["toggleDrawer"]),
    load() {
      api
        .ListMyChannels()
        .then((response) => {
          this.channels = response.data;
          const channel = this.channels.find((el) => el.id == this.channelid);
          if (channel) {
            this.channel = channel;
          } else {
            this.channel = null;
          }
        });
    },
    logout() {
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      });
      this.$store.commit("user", {});
      this.$router.replace({ name: 'Home' })
    },
  },
  watch: {
    channelid(to) {
      this.channelMenuOpen = !to;
    },
    $route() {
      this.load();
    },
  },
  created() {
    this.load();
  },
};
</script>
