<template>
  <v-container v-if="video" id="Player" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="video" class="mx-n2" />
      </v-col>
      <Suggestions class="col-md-4 col-xl-3 col-12" :video="video" />
    </v-row>
  </v-container>
</template>

<script>
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import Suggestions from "@/components/Suggestions";

import { api } from "@/services/api.js";

export default {
  name: "Player",
  components: {
    VideoPlayerWrapper,
    Suggestions,
  },
  props: ["id"],
  data() {
    return {
      video: null,
    };
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.load();
    this.$store.commit("toggleDrawer", false);
  },
  methods: {
    load() {
      api.Recordings.Get(this.id, { count_viewer: true }).then((response) => {
        this.video = response.data;
      });
    },
  },
};
</script>
