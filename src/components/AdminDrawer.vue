<template>
  <v-navigation-drawer
    :value="drawer"
    app
    :class="[darkMode ? 'neutral lighten-1' : null]"
    mobile-breakpoint="600"
    @input="toggleDrawer"
  >
    <v-list>
      <v-list-item v-if="channel">
        <router-link
          :to="{
            name: 'ChannelProfile',
            params: { channelid: selectionAdminChannel },
          }"
        >
          <v-list-item-avatar color="black">
            <v-img v-if="channel.logo" :src="channel.logo.url" contain />
            <span v-else>{{ channel.title.slice(0, 2) }}</span>
          </v-list-item-avatar></router-link
        >

        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn icon small v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group>
              <v-list-item
                input-value="false"
                :to="{
                  name: 'ChannelProfile',
                  params: { channelid: selectionAdminChannel },
                }"
              >
                <v-list-item-title>Edit Channel</v-list-item-title>
                <v-list-item-icon>
                  <v-icon small> mdi-pencil </v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item :to="{ path: '/' }" target="_blank">
                <v-list-item-title>Open Mediathek</v-list-item-title>
                <v-list-item-icon>
                  <v-icon small> mdi-open-in-new </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-list-item>
      <v-list-group
        no-action
        append-icon="mdi-menu-down"
        :class="darkMode ? 'text--text' : 'secondary--text text--darken-1'"
      >
        <template #activator>
          <v-list-item-content>
            <v-list-item-title v-if="channel" class="text-h7">
              {{ channel.title }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="channel"> ❤️ 🏳️‍🌈 </v-list-item-subtitle>
            <v-list-item-title v-else class="text-h7">
              Channels:
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(channel, i) in channels"
            :key="i"
            link
            :to="{ name: 'AdminChannel', params: { channelid: channel.id } }"
          >
            <v-list-item-avatar color="black" size="24" class="mr-8">
              <v-img v-if="channel.logo" :src="channel.logo.url" contain />
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
        </v-list>
      </v-list-group>
    </v-list>
    <v-divider />
    <v-list v-if="channel" nav dense>
      <v-subheader>Channel</v-subheader>
      <v-list-item
        v-for="item in channelMenu"
        :key="item.name"
        link
        :to="{
          name: item.name,
          params: { channel: channel },
        }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
          <v-badge v-if="item.dev" overlap color="grey" content="dev" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list nav dense>
      <v-subheader>Global</v-subheader>
      <v-list-item
        v-for="item in globalMenu"
        :key="item.name"
        link
        :to="{ name: item.name }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
          <v-badge v-if="item.dev" overlap color="grey" content="dev" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template #append>
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
import { config } from "../../config.js";

export default {
  name: "AdminDrawer",
  props: ["channelid"],
  data() {
    return {
      channelMenuOpen: true,
      channel: null,
      channels: [],
      channelMenu: [
        {
          name: "AdminChannelLive",
          icon: "mdi-broadcast",
          title: "Live",
        },
        {
          name: "ChannelDistribution",
          icon: "mdi-multicast",
          title: "Distribution",
        },
        {
          name: "StreamSchedule",
          icon: "mdi-calendar",
          title: "Stream Schedule",
        },
        { name: "ChannelRecordings", icon: "mdi-video", title: "Recordings" },
        {
          name: "ChannelSpeakers",
          icon: "mdi-tooltip-account",
          title: "Speakers",
        },
        { name: "ChannelEvents", icon: "mdi-calendar", title: "Events" },
      ],
      globalMenu: [
        {
          name: "Global Stream Schedule",
          icon: "mdi-calendar",
          title: "Global Stream Schedule",
        },
        {
          name: "Stats",
          icon: "mdi-chart-timeline-variant",
          title: "Stats",
          dev: true,
        },
        { name: "Server", icon: "mdi-server", title: "Server" },
        { name: "About", icon: "mdi-information", title: "About" },
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
        const channel = this.channels.find(
          (el) => el.id == this.selectionAdminChannel
        );
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
      this.channelMenuOpen = false;
    } else {
      this.setSelectionAdminChannel(config.defaultChannelID);
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
