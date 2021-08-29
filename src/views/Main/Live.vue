<template>
  <v-container fluid id="Live">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper :video="video" :source="source" class="mx-n2" />
      </v-col>
      <v-col cols="12" md="4" v-if="video !== null && video.chat">
        <ChatBox class="ma-2" :room="video.channel.id" />
      </v-col>
      <Suggestions
        class="col-md-4 col-xl-3 col-12"
        v-if="video === null || !video.chat"
        :video="video"
       />
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
      api.Streams.Get(this.id).then((response) => {
        // skip websocket binding on existing stream
        if (this.video == null || response.data.channel.id != this.video.channel.id) {
          websocket.joinHandler(response.data.channel.id, 'status', (ev) => {
            this.$set(this.video, 'viewers', ev.viewers);
            this.$set(this.video, 'running', ev.running);
            if (ev.stream != this.video.id) {
              console.log("new stream description", ev.stream, this.video.channel.id)
              this.load()
            }
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
