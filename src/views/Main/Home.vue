<template>
  <v-container fluid id="Home">
    <v-row v-if="streams" class="mb-12">
      <v-col>
        <h1 class="px-2 headline">Live</h1>
        <v-divider class="mx-2" />
        <VideoList :videos="streams" />
      </v-col>
    </v-row>
    <v-row v-if="recordings" class="mb-12">
      <v-col>
        <h1 class="px-2 headline">Recordings</h1>
        <v-divider class="mx-2" />
        <VideoList :videos="recordings" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoList from "@/components/VideoList";

import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: { VideoList },
  computed: {
    ...mapGetters(["recordings"]),
    streams() {
      const result = [
        {
          id: "kukoon",
          isLive: true,
          common_name: "stream common_name",
          poster:
            "https://media.kukoon.de/videos/df1555f5-7046-4f7a-adcc-195b73949723/edb1cfbb-3476-d639-b3f5-795fabf4ef4d_20210207_111945mp4",
        },
      ];
      return result;
    },
  },
  created() {
    this.$store.dispatch("loadRecordings");
  },
};
</script>