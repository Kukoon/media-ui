<template>
  <v-container id="Home" fluid>
    <v-row v-if="streamsLive.length > 0" class="mb-4">
      <v-col>
        <h1 class="px-2 headline">Live Stream</h1>
        <v-divider class="mx-2 mb-2 mt-2" />
        <VideoList :videos="streamsLive" :is-stream="true" />
      </v-col>
    </v-row>
    <v-row v-if="streamsUpcoming.length > 0" class="mb-4">
      <v-col>
        <VideoRow
          title="Upcoming Streams"
          :videos="streamsUpcoming"
          :no-link="true"
        />
      </v-col>
    </v-row>
    <v-row v-for="(row, n) in recordingConfigs" :key="row + n" class="mt-0">
      <v-col>
        <VideoRow :title="row.title" :params="row.params" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoList from "@/components/VideoList";
//import VideoGrid from "@/components/VideoGrid";
import VideoRow from "@/components/VideoRow";

import { config } from "../../../config.js"; // home recordings
import { api } from "@/services/api.js";

export default {
  name: "Home",
  components: { VideoList, VideoRow },
  data() {
    return {
      streamsLive: [],
      streamsUpcoming: [],
      recordingConfigs: [
        {
          title: "Latest Recordings",
          params: {},
        },
      ].concat(config.home.recordings),
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      api.Streams.List({ running: true }).then(
        (response) => (this.streamsLive = response.data)
      );
      api.Streams.List({ upcoming: true }).then(
        (response) => (this.streamsUpcoming = response.data)
      );
    },
  },
};
</script>
