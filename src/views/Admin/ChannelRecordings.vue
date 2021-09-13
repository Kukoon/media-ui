<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <h3>Recordings of {{ channel.title }}</h3>
        <v-divider class="mt-2"></v-divider>
        <v-fab-transition>
          <v-btn
            color="green"
            fixed
            bottom
            right
            fab
            :to="{ name: 'RecordingAdd', params: {channelid: channelid } }"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
        <VideoManager :channelid="channelid" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoManager from "@/components/VideoManager.vue";

import { api } from "@/services/api.js";

export default {
  name: "ChannelRecordings",
  components: { VideoManager },
  props: ["channelid"],
  data() {
    return {
      channel: { title: 'unknown' },
    };
  },
  methods: {
    load() {
      api
        .Channels.Get(this.channelid)
        .then((response) => this.channel = response.data );
    },
  },
  watch: {
    channelid() {
      this.load();
    },
  },
  created() {
    this.load();
  },
};
</script>
