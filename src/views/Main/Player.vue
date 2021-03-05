<template>
  <v-container fluid id="Player" v-if="recording">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="recording" class="mx-n2" />
      </v-col>
      <v-col cols="12" md="4" xl="3">
        <h3 class="mx-2 mt-2">Suggestions</h3>
        <v-divider class="mx-2 mb-4 mt-2" />
        <Suggestions class="hidden-sm-and-down" :videos="suggestions" />
        <VideoList class="hidden-md-and-up" :videos="suggestions" />
      </v-col>
      <v-col cols="0" md="0" xl="1" />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import VideoList from "@/components/VideoList";
import Suggestions from "@/components/Suggestions";

import { config } from "../../../config.js";

import { mapGetters } from "vuex";

export default {
  name: "Player",
  components: {
    VideoPlayerWrapper,
    VideoList,
    Suggestions,
  },
  data() {
    return {
      currentID: this.$router.history.current.query.id,
      recording: null,
    };
  },
  computed: {
    ...mapGetters(["recordings"]),
    suggestions() {
      const result = this.recordings.filter(
        (recording) => recording.id != this.currentID
      );
      return result.slice(0, 3);
    },
  },
  methods: {
    loadRecording() {
      const apiURL =
        config.apiURL +
        "recording/" +
        this.$router.history.current.query.id +
        "?lang=de";
      axios.get(apiURL).then((response) => (this.recording = response.data));
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
      this.loadRecording();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name !== "Player") {
        vm.$store.commit("autoPlay", true);
      }
    });
  },
  created() {
    this.loadRecording();
    this.currentID = this.$router.history.current.query.id;
  },
};
</script>
