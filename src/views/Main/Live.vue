<template>
  <v-container fluid id="Live">
    <v-row no-gutters>
      <v-col cols="12" sm="8" class="d-flex flex-column">
        <v-card outlined tile class="ma-4">
          <v-responsive :aspect-ratio="16 / 9" class="responsive">
            <PlyrPlayer :source="source" :isLive="isLive" />
          </v-responsive>
        </v-card>
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
import PlyrPlayer from "@/components/PlyrPlayer";

import ChatBox from "@/components/ChatBox";
import video from "@/data/VideoData.json";
import VideoDescription from "@/components/VideoDescription";
import VideoTitle from "@/components/VideoTitle.vue";

export default {
  name: "Live",
  components: {
    PlyrPlayer,
    ChatBox,
    VideoDescription,
    VideoTitle,
  },
  data() {
    return {
      sourceURL: "https://v2.media.kukoon.de/stream/hls/",
      poster: video[2].poster,
      video: video[2],
      tagsPosition: "top",
      currentID: null,
      isLive: true,
    };
  },
  computed: {
    source() {
      return this.sourceURL + this.currentID + ".m3u8";
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.currentID = this.$router.history.current.query.id;
  },
};
</script>