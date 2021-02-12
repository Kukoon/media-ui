<template>
  <v-container fluid id="Player" v-if="recording">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <div>
          <v-card outlined tile class="ma-2">
            <v-responsive :aspect-ratio="16 / 9" class="responsive">
              <VideoPlayer
                v-if="recording.formats[0].url && recording.poster"
                class="flex-column"
                :source="recording.formats[0].url"
                :poster="recording.poster"
              />
            </v-responsive>
          </v-card>
        </div>
        <VideoTitle :video="recording" class="pt-2" />
        <VideoDescription :video="recording" :tagsPosition="tagsPosition" />
      </v-col>
      <v-col cols="12" md="4" xl="3">
        <h3 class="mx-2 mt-2">Suggestions</h3>
        <v-divider class="mx-2 mb-4 mt-2" />
        <Suggestions class="hidden-sm-and-down" />
        <RecordingsList class="hidden-md-and-up" />
      </v-col>
      <v-col cols="0" md="0" xl="1" />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import VideoDescription from "../../components/VideoDescription.vue";
import VideoPlayer from "../../components/VideoPlayer";
import VideoTitle from "../../components/VideoTitle.vue";
import RecordingsList from "../../components/RecordingsList";
import Suggestions from "../../components/Suggestions";

export default {
  name: "Player",
  components: {
    VideoDescription,
    VideoPlayer,
    VideoTitle,
    RecordingsList,
    Suggestions,
  },
  data() {
    return {
      currentID: this.$router.history.current.query.id,
      tagsPosition: "top",
      recording: null,
    };
  },
  methods: {
    loadRecording() {
      const apiURL =
        "https://v2.media.kukoon.de/api/v1/recording/" +
        this.$router.history.current.query.id;
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
  },
};
</script>