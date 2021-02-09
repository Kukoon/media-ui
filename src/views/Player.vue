<template>
  <v-container fluid>
    <h1 class="ma-2">Player</h1>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayer
          class="pa-2 flex-column"
          :source="source"
          :poster="poster"
        />
        <VideoTitle :video="video" class="pt-2" />
        <VideoDescription :video="video" :tagsPosition="tagsPosition" />
      </v-col>
      <v-col cols="12" md="4" xl="3">
        <h2 class="mx-2">Suggestions</h2>
        <SuggestionsBox class="hidden-sm-and-down" />
        <RecordingsList class="hidden-md-and-up" />
      </v-col>
      <v-col cols="0" md="0" xl="1" />
    </v-row>
  </v-container>
</template>

<script>
import video from "../data/VideoData.json";
import VideoDescription from "../components/VideoDescription.vue";
import VideoPlayer from "../components/VideoPlayer";
import VideoTitle from "../components/VideoTitle.vue";
import RecordingsList from "../components/RecordingsList";
import SuggestionsBox from "../components/SuggestionsBox";

export default {
  name: "Player",
  components: {
    VideoDescription,
    VideoPlayer,
    VideoTitle,
    RecordingsList,
    SuggestionsBox,
  },
  data() {
    return {
      source: video[2].source,
      poster: video[2].poster,
      video: video[2],
      tagsPosition: "top",
    };
  },
};
</script>