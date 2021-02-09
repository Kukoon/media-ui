<template>
  <v-container fluid>
    <h1 class="ma-2">Live</h1>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayer
          class="pa-2 flex-column"
          :source="source"
          :poster="poster"
        />
        <Description :meta="meta" :chipsPosition="chipsPosition" />
      </v-col>
      <v-col cols="12" md="4">
        <ChatBox class="ma-2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChatBox from "../components/ChatBox";
import video from "../data/VideoData.json";
import VideoPlayer from "../components/VideoPlayer";
import Description from "../components/Description";

export default {
  name: "Live",
  components: { ChatBox, VideoPlayer, Description },
  data() {
    return {
      source: video[2].source,
      poster: video[2].poster,
      meta: video[2],
      chipsPosition: "top",
    };
  },
};
</script>