<template>
  <v-container fluid id="Player">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayer
          class="pa-2 flex-column"
          :source="source"
          :poster="poster"
        />
        <VideoTitle :video="videoObj" class="pt-2" />
        <VideoDescription :video="videoObj" :tagsPosition="tagsPosition" />
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
import video from "../../data/VideoData.json";
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
    };
  },
  computed: {
    poster() {
      return video[this.currentID].poster;
    },
    source() {
      return video[this.currentID].source;
    },
    videoObj() {
      return video[this.currentID];
    },
  },
  watch: {
    $route(to) {
      this.currentID = to.query.id;
    },
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