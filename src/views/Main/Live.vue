<template>
  <v-container fluid id="Live">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="video" :source="source" class="mx-n2" />
      </v-col>
      <v-col cols="12" md="4" v-if="video !== null && video.chat">
        <ChatBox class="ma-2" :room="video.channel.id" />
      </v-col>
      <v-col cols="12" md="4" v-if="video === null || !video.chat">
        <h3 class="mx-2 mt-2">Suggestions</h3>
        <v-divider class="mx-2 mb-4 mt-2" />
        <Suggestions class="hidden-sm-and-down" :video="video" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChatBox from "@/components/ChatBox";
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import Suggestions from "@/components/Suggestions";

import { config } from "../../../config.js"; // HLS url
import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Live",
  props: ['id'],
  components: {
    ChatBox,
    VideoPlayerWrapper,
    Suggestions,
  },
  data() {
    return {
      video: null,
      source: "",
      viewers: 0,
      tagsPosition: "top",
      isRunning: true,
    };
  },
  methods: {
    load() {
      api.GetStream(this.id).then((response) => {
        // skip websocket binding on existing stream
        if (this.video == null || response.data.channel.id != this.video.channel.id) {
          websocket.joinHandler(response.data.channel.id, 'status', (ev) => {
            this.video.viewers = ev.viewers;
            if (ev.stream != this.video.id) {
              console.log("new stream description", ev.stream, this.video.channel.id)
              this.load()
            }
            this.video.running = ev.running;
          })
        }
        // update description 
        this.video = response.data;
        this.source = config.sourceURL.replace("{ID}", this.video.channel.id);
      });
    },
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.load();
  },
};
</script>
