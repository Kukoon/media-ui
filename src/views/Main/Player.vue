<template>
  <v-container fluid id="Player" v-if="video">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="video" class="mx-n2" />
      </v-col>
      <Suggestions cols="12" md="4" xl="3" :video="video" />
      <v-col cols="0" md="0" xl="1" />
    </v-row>
  </v-container>
</template>

<script>
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import Suggestions from "@/components/Suggestions";

import { api } from "@/services/api.js";

export default {
  name: "Player",
  props: ['id'],
  components: {
    VideoPlayerWrapper,
    Suggestions,
  },
  data() {
    return {
      video: null,
    };
  },
  methods: {
    load() {
      api.GetRecording(this.id).then((response) => {
        this.video = response.data;
      })
    },
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name !== "Player") {
        vm.$store.commit("autoPlay", true);
      }
    });
  },
};
</script>
