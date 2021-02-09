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
        <Description :meta="meta" :tagsPosition="tagsPosition" class="pt-4" />
      </v-col>
      <v-col cols="12" md="4" lg="3">
        <h2 class="mx-2">Suggestions</h2>
        <SuggestionsBox class="ma-2 hidden-sm-and-down" />
        <RecordingsList class="hidden-md-and-up" />
      </v-col>
      <v-col cols="0" md="0" lg="1" />
    </v-row>
  </v-container>
</template>

<script>
import video from "../data/VideoData.json";
import VideoPlayer from "../components/VideoPlayer";
import Description from "../components/Description";
import RecordingsList from "../components/RecordingsList";
import SuggestionsBox from "../components/SuggestionsBox";

export default {
  name: "Player",
  components: { Description, VideoPlayer, RecordingsList, SuggestionsBox },
  data() {
    return {
      source: video[2].source,
      poster: video[2].poster,
      meta: video[2],
      tagsPosition: "top",
    };
  },
};
</script>