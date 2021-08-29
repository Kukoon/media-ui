<template>
  <v-container fluid id="Home">
    <v-row v-if="streamsLive.length > 0" class="mb-12">
      <v-col>
        <h1 class="px-2 headline">Live</h1>
        <v-divider class="mx-2 mb-2 mt-2" />
        <VideoList :videos="streamsLive" :isStream="true" />
      </v-col>
    </v-row>
    <v-row v-if="streamsUpcoming.length > 0" class="mb-12">
      <v-col>
        <h1 class="px-2 headline">Upcoming</h1>
        <v-divider class="mx-2 mb-2 mt-2" />
        <VideoGrid :videos="streamsUpcoming" :noLink="true" />
      </v-col>
    </v-row>
    <v-row v-if="recordings.length > 0" class="mb-12">
      <v-col>
        <h1 class="px-2 headline">Recordings</h1>
        <v-divider class="mx-2 mb-2 mt-2" />
        <VideoGrid :videos="recordings" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoList from "@/components/VideoList";
import VideoGrid from "@/components/VideoGrid";

import { api } from "@/services/api.js";

export default {
  name: "Home",
  components: { VideoList, VideoGrid },
  data() {
    return {
      recordings: [],
      streamsLive: [],
      streamsUpcoming: [],
    }
  },
  methods: {
    load() {
      api.Streams.List({"running": true}).then((response) => (this.streamsLive = response.data))
      api.Streams.List({"upcoming": true}).then((response) => (this.streamsUpcoming = response.data))
      api.Recordings.List().then((response) => (this.recordings = response.data.slice(0, 6)))
    },
  },
  created() {
    this.load();
  },
};
</script>
