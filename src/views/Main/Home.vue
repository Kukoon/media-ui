<template>
  <v-container fluid id="Home">
    <v-row v-if="streamsLive.length > 0" class="mb-4">
      <v-col>
        <h1 class="px-2 headline">Live Stream</h1>
        <v-divider class="mx-2 mb-2 mt-2" />
        <VideoList :videos="streamsLive" :isStream="true" />
      </v-col>
    </v-row>
    <v-row v-if="streamsUpcoming.length > 0" class="mb-4">
      <v-col>
        <VideoRow
          :videos="streamsUpcoming"
          :noLink="true"
          title="Upcoming Streams"
        />
      </v-col>
    </v-row>
    <v-row v-for="(row, n) in rows" :key="row + n" class="mt-0">
      <v-col>
        <VideoRow
          :videos="recordings"
          :title="row.title"
          :eventID="row.eventID"
          :tagID="row.tagID"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoList from "@/components/VideoList";
//import VideoGrid from "@/components/VideoGrid";
import VideoRow from "@/components/VideoRow";

import { api } from "@/services/api.js";

export default {
  name: "Home",
  components: { VideoList, VideoRow },
  data() {
    return {
      recordings: [],
      streamsLive: [],
      streamsUpcoming: [],
      rows: [
        {
          title: "Latest Recordings",
        },
        {
          title: "Buchvorstellungen",
          tagID: "0bca0cf4-a9b9-46d7-821f-18c59c08fc1d",
        },
        {
          title: "Grand Piano Festival 2021",
          eventID: "4abb3a05-60a3-4be5-a6aa-323b9755e0b5",
        },
      ],
    };
  },
  methods: {
    load() {
      api.Streams.List({ running: true }).then(
        (response) => (this.streamsLive = response.data)
      );
      api.Streams.List({ upcoming: true }).then(
        (response) => (
          (this.streamsUpcoming = response.data), console.log(response.data)
        )
      );
      api.Recordings.List().then(
        (response) => (this.recordings = response.data)
      );
    },
  },
  created() {
    this.load();
  },
};
</script>
