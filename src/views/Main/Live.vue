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
    init() {
      api.Channels.Get(this.id).then((resp) => {
        this.source = config.sourceURL.replace("{ID}", resp.data.id);
        websocket.joinHandler(resp.data.id, 'status', 'live for status', (ev) => {
          this.$set(this.video, 'viewers', ev.viewers);
          this.$set(this.video, 'running', ev.running);
          if (ev.stream != this.video.id) {
            if (ev.stream == "00000000-0000-0000-0000-000000000000") {
              console.log("load stream description - no new", ev.stream, this.video.channel.id)
            } else {
              console.log("load stream description - next", ev.stream, this.video.channel.id)
            }
            this.load()
            // try trigger stream again
            this.source = config.sourceURL.replace("{ID}", resp.data.id);
          }
        })
      })
    },
    load() {
      api.Channels.GetStream(this.id).then((resp) => {
        this.video = resp.data;
	if (this.video.poster == "") {
          this.video.poster = resp.data.channel.logo;
	}
      }, () => {
        api.Channels.Get(this.id).then((resp) => {
          this.video = {
            id: "00000000-0000-0000-0000-000000000000",
            channel: resp.data,
            poster: resp.data.logo,
            lang: {
              title: "No Stream Live",
              subtitle: "no event scheduled",
              short: "This Channel has no stream event scheduled",
              long: "This Channel has no stream event scheduled",
            },
          };
        });
      });
    },
  },
  watch: {
    id() {
      this.init();
      this.load();
    },
  },
  created() {
    this.$store.commit("autoPlay", true);
    this.init();
    this.load();
  },
};
</script>
