<template>
  <v-container fluid id="Live">
    <v-row no-gutters>
      <v-col cols="12" sm="8" class="d-flex flex-column">
        <VideoPlayer
          class="pa-2 flex-column"
          :source="source"
          :poster="poster"
        />
        <VideoTitle :video="video" class="pt-2" />
        <VideoDescription :video="video" :tagsPosition="tagsPosition" />
      </v-col>
      <v-col cols="12" sm="4">
        <ChatBox class="ma-2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChatBox from "@/components/ChatBox";
import video from "@/data/VideoData.json";
import VideoDescription from "@/components/VideoDescription";
import VideoPlayer from "@/components/VideoPlayer";
import VideoTitle from "@/components/VideoTitle.vue";

export default {
  name: "Live",
  components: { ChatBox, VideoDescription, VideoPlayer, VideoTitle },
  data() {
    return {
      source: "https://v2.media.kukoon.de/stream/hls/live.m3u8",
      poster: video[2].poster,
      video: video[2],
      tagsPosition: "top",
    };
  },
  created() {
    this.$store.commit("autoPlay", true);
  },
};
</script>