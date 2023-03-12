<template>
  <v-container id="Live" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="d-flex flex-column">
        <VideoPlayerWrapper
          ref="player"
          :video="video"
          :sources="sources"
          :autostart="true"
          class="mx-n2"
        />
      </v-col>
      <v-col v-if="video !== null && video.chat" cols="12" md="4">
        <ChatBox class="ma-2" :room="video.channel.id" />
      </v-col>
      <Suggestions
        v-if="video === null || !video.chat"
        class="col-md-4 col-xl-3 col-12"
        :video="video"
      />
    </v-row>
  </v-container>
</template>

<script>
import ChatBox from "@/components/ChatBox";
import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import Suggestions from "@/components/Suggestions";

import { api } from "@/services/api.js";
import { websocket } from "@/services/websocket.js";

export default {
  name: "Live",
  components: {
    ChatBox,
    VideoPlayerWrapper,
    Suggestions,
  },
  props: ["id"],
  data() {
    return {
      video: null,
      sources: "",
    };
  },
  watch: {
    id() {
      this.init();
      this.load();
    },
  },
  created() {
    this.init();
    this.load();
  },
  methods: {
    init() {
      api.Channels.Get(this.id).then((resp) => {
        this.sources = resp.data.stream_sources;
        websocket.joinHandler(
          resp.data.data.id,
          "status",
          "live for status",
          (ev) => {
            this.$set(this.video, "viewers", ev.viewers);
            this.$set(this.video, "running", ev.running);
            if (ev.stream != this.video.id) {
              if (ev.stream == "00000000-0000-0000-0000-000000000000") {
                console.log(
                  "load stream description - no new",
                  ev.stream,
                  this.video.channel.id
                );
              } else {
                console.log(
                  "load stream description - next",
                  ev.stream,
                  this.video.channel.id
                );
              }
              this.load();
              this.$refs.player.play();
            }
          }
        );
      });
    },
    load() {
      api.Channels.GetStream(this.id).then(
        (resp) => {
          this.video = resp.data;
          if (this.video.poster) {
            this.video.poster = resp.data.channel.logo;
          }
        },
        () => {
          api.Channels.Get(this.id).then((resp) => {
            this.video = {
              id: "00000000-0000-0000-0000-000000000000",
              channel: resp.data.data,
              poster: resp.data.data.logo,
              lang: {
                title: "No Stream Live",
                subtitle: "no event scheduled",
                short: "This Channel has no stream event scheduled",
                long: "This Channel has no stream event scheduled",
              },
            };
          });
        }
      );
    },
  },
};
</script>
